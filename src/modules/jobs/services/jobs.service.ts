import { Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateJobDto } from "../dtos/requests/create-job.dto";
import {
  OrderType,
  PaginationQueryDto,
  SearchQueryDto,
} from "src/common/dtos/pagination.dto";
import { CreatedBy, JobStatus, Prisma } from "@prisma/client";
import { JobPaginationResponseDto } from "../dtos/responses/job.response.dto";
import { SortOrder } from "src/common/enums/order.enum";
import { pageLimit } from "src/common/helper/pagination.helper";
import { ILoggedUserInfo } from "src/modules/auth/interfaces/logged-user-info.interface";
import { NotFoundException } from "src/common/exceptions/errors/common/not-found.exception.filter";

@Injectable()
export class JobsService {
  constructor(private readonly databaseService: DatabaseService) {}
  private readonly logger: Logger = new Logger(JobsService.name);

  private readonly JobModel = this.databaseService.job;
  // private readonly JobCategoryModel = this.databaseService.jobCategory;
  // private readonly JobPositionModel = this.databaseService.jobPosition;

  // async findName(name: string) {
  //   const organization = await this.databaseService.organization.findUnique({
  //     where: { name },
  //   });
  //   return organization;
  // }

  // async findCode(code: string) {
  //   const organization = await this.databaseService.organization.findUnique({
  //     where: { code },
  //   });
  //   return organization;
  // }

  async findById(id: string) {
    const job = await this.JobModel.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });
    return job;
  }

  async update(id: string, data: Prisma.JobUpdateInput) {
    return this.JobModel.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.JobModel.delete({
      where: { id },
    });
  }

  async getJob(id: string) {
    const job = await this.JobModel.findUnique({
      where: { id },
      include: {
        jobSkills: {
          select: {
            skill: true,
          },
        },
        jobCategory: true,
        organization: {
          include: {
            logo: true,
          },
        },
        user: true,
      },
    });

    // const skills = job.jobSkills.map((jobSkill) => {
    //   return {
    //     id: jobSkill.skill.id,
    //     skill: jobSkill.skill.name,
    //   };
    // });
    // console.log({ skills });
    // job.skills = skills;
    return job;
  }
  async create(data: CreateJobDto, loggedUserInfo?: ILoggedUserInfo) {
    this.logger.log("Creating a job...");
    const { jobCategory, jobSkills, organization, ...rest } = data;

    // use promise all to get jobCategory and organization and skills
    const [category, org, skills] = await Promise.all([
      this.databaseService.jobCategory.findUnique({
        where: { id: jobCategory },
      }),
      this.databaseService.organization.findUnique({
        where: { id: organization },
      }),
      this.databaseService.skill.findMany({
        where: { id: { in: jobSkills } },
      }),
    ]);

    if (!category) throw new NotFoundException("Job Category not found");
    if (!org) throw new NotFoundException("Organization not found");
    if (skills.length !== jobSkills.length)
      throw new NotFoundException("Job Skills not found");

    const query: Prisma.JobUncheckedCreateInput = {
      // userId: loggedUserInfo?.id,
      ...rest,
      createdBy: loggedUserInfo ? CreatedBy.LOGGED_USER : CreatedBy.NOT_LOGGED,
      status: JobStatus.DRAFT,
      // jobCategory: { connect: { id: jobCategory } },
      // organization: { connect: { id: organization } },
      jobCategoryId: jobCategory,
      organizationId: organization,
      jobSkills: {
        create: jobSkills.map((id) => ({ skill: { connect: { id } } })),
      },
    };
    if (!!loggedUserInfo) {
      query.userId = loggedUserInfo.id;
    }

    return this.JobModel.create({
      data: query,
    });
  }

  async jobsPaginated(
    paginationQuery: PaginationQueryDto,
    orderType: OrderType,
    loggedUserInfo?: ILoggedUserInfo
  ): Promise<JobPaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = "createdAt";
    const query: Prisma.JobFindManyArgs = {
      where: {
        status: JobStatus.PUBLISHED,
      },
    };
    if (!!loggedUserInfo) {
      query.where.userId = loggedUserInfo.id;
    }
    const { page, limit } = pageLimit(paginationQuery);
    const total = await this.JobModel.count({
      where: query.where,
    });

    const pages = Math.ceil(total / limit);
    const startIndex = page < 1 ? 0 : (page - 1) * limit;

    const results = await this.JobModel.findMany({
      include: {
        jobCategory: true,
        organization: true,
        jobSkills: {
          include: {
            skill: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      where: query.where,
      skip: startIndex,
      take: limit,
      orderBy: {
        [orderBy]: orderIn,
      },
    });
    return { limit, page, pages, total, results };
  }
  async jobSearchPaginated(
    paginationQuery: PaginationQueryDto,
    orderType: OrderType,
    searchQueryDto: SearchQueryDto,
    loggedUserInfo?: ILoggedUserInfo
  ): Promise<JobPaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = "name";
    const query: Prisma.JobFindManyArgs = {
      where: {
        status: JobStatus.PUBLISHED,
        // userId,
        [orderBy]: {
          contains: searchQueryDto.search ? searchQueryDto.search : "",
          mode: "insensitive",
        },
      },
    };
    if (!!loggedUserInfo) {
      query.where.userId = loggedUserInfo.id;
    }

    const { page, limit } = pageLimit(paginationQuery);
    const total = await this.JobModel.count({
      where: query.where,
    });

    const pages = Math.ceil(total / limit);
    const startIndex = page < 1 ? 0 : (page - 1) * limit;

    const results = await this.JobModel.findMany({
      include: {
        jobCategory: true,
        organization: true,
        jobSkills: {
          include: {
            skill: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      where: query.where,
      skip: startIndex,
      take: limit,
      orderBy: {
        [orderBy]: orderIn,
      },
    });
    return { limit, page, pages, total, results };
  }

  async jobsPaginatedAll(
    paginationQuery: PaginationQueryDto,
    orderType: OrderType
    // loggedUserInfo: ILoggedUserInfo
  ): Promise<JobPaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = "createdAt";
    const query: Prisma.JobFindManyArgs = {
      where: {
        // status: JobStatus.PUBLISHED,
      },
    };
    const { page, limit } = pageLimit(paginationQuery);
    const total = await this.JobModel.count({
      where: query.where,
    });

    const pages = Math.ceil(total / limit);
    const startIndex = page < 1 ? 0 : (page - 1) * limit;

    const results = await this.JobModel.findMany({
      include: {
        jobCategory: true,
        organization: true,
        jobSkills: {
          include: {
            skill: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      where: query.where,
      skip: startIndex,
      take: limit,
      orderBy: {
        [orderBy]: orderIn,
      },
    });
    return { limit, page, pages, total, results };
  }
}
