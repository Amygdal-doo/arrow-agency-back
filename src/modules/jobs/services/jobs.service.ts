import { Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateJobDto } from "../dtos/requests/create-job.dto";
import {
  JobSearchQueryDto,
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
import { Cron, CronExpression } from "@nestjs/schedule";

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

  async update(
    id: string,
    data: Prisma.JobUpdateInput,
    tx?: Prisma.TransactionClient
  ) {
    const prisma = tx || this.databaseService;
    return prisma.job.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.databaseService;
    return prisma.job.delete({
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
        // status: JobStatus.PUBLISHED, // need to return
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
    jobSearchQueryDto: JobSearchQueryDto,
    loggedUserInfo?: ILoggedUserInfo
  ): Promise<JobPaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = "name";
    console.log({ jobSearchQueryDto });

    const query: Prisma.JobFindManyArgs = {
      where: {
        // status: JobStatus.PUBLISHED, // need to return
        // userId,
        [orderBy]: {
          contains: jobSearchQueryDto.search ? jobSearchQueryDto.search : "",
          mode: "insensitive",
        },
      },
    };
    if (!!loggedUserInfo) {
      query.where.userId = loggedUserInfo.id;
    }
    if (jobSearchQueryDto.worldwide !== undefined) {
      query.where.worldwide = jobSearchQueryDto.worldwide;
    }
    if (!!jobSearchQueryDto.remote !== undefined) {
      query.where.remote = jobSearchQueryDto.remote;
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

  // cron job

  // @Cron(CronExpression.EVERY_10_SECONDS)
  @Cron(CronExpression.EVERY_WEEK)
  async deleteExpiredDraftJobs() {
    this.logger.log("Deleting expired draft jobs...");
    await this.JobModel.deleteMany({
      where: {
        status: JobStatus.DRAFT,
        createdAt: {
          lte: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days
        },
      },
    });
  }
}
