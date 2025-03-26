import { Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateJobDto } from "../dtos/requests/create-job.dto";
import {
  OrderType,
  OrganizationSearchQueryDto,
  PaginationQueryDto,
  SearchQueryDto,
} from "src/common/dtos/pagination.dto";
import { JobStatus, Prisma } from "@prisma/client";
import { JobPaginationResponseDto } from "../dtos/responses/job.response.dto";
import { SortOrder } from "src/common/enums/order.enum";
import { pageLimit } from "src/common/helper/pagination.helper";

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

  async create(data: CreateJobDto) {
    const { jobCategory, jobSkills, organization, ...rest } = data;

    return this.JobModel.create({
      data: {
        ...rest,
        status: JobStatus.DRAFT,
        jobCategory: { connect: { id: jobCategory } },
        organization: { connect: { id: organization } },
        jobSkills: {
          create: jobSkills.map((id) => ({ skill: { connect: { id } } })),
        },
      },
    });
  }

  async jobsPaginated(
    paginationQuery: PaginationQueryDto,
    orderType: OrderType
  ): Promise<JobPaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = "createdAt";
    const query: Prisma.JobFindManyArgs = {
      where: {},
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
  async jobSearchPaginated(
    paginationQuery: PaginationQueryDto,
    orderType: OrderType,
    searchQueryDto: SearchQueryDto
  ): Promise<JobPaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = "name";
    const query: Prisma.JobFindManyArgs = {
      where: {
        // userId,
        [orderBy]: {
          contains: searchQueryDto.search ? searchQueryDto.search : "",
          mode: "insensitive",
        },
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
