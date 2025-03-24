import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  OrderType,
  OrganizationSearchQueryDto,
  PaginationQueryDto,
} from "src/common/dtos/pagination.dto";
import { SortOrder } from "src/common/enums/order.enum";
import { pageLimit } from "src/common/helper/pagination.helper";
import { DatabaseService } from "src/database/database.service";
import { JobCategoryPaginationResponseDto } from "../dtos/responses/job_category.response.dto";
import { CreateJobCategoryDto } from "../dtos/requests/create-jog_category.dto";

@Injectable()
export class JobCategoryService {
  constructor(private readonly databaseService: DatabaseService) {}
  private readonly logger: Logger = new Logger(JobCategoryService.name);

  private readonly JobCategoryModel = this.databaseService.jobCategory;

  async findName(name: string) {
    return this.JobCategoryModel.findUnique({
      where: { name },
    });
  }

  async findCode(code: string) {
    return this.JobCategoryModel.findUnique({
      where: { code },
    });
  }

  async create(data: CreateJobCategoryDto) {
    data.code = data.code.toUpperCase();
    data.name = data.name.toUpperCase();

    const [name, code] = await Promise.all([
      this.findName(data.name),
      this.findCode(data.code),
    ]);
    if (name) throw new BadRequestException("Job Category name already exist");
    if (code) throw new BadRequestException("job Category code already exist");

    return this.JobCategoryModel.create({ data });
  }

  async jobCategorySearchPaginated(
    paginationQuery: PaginationQueryDto,
    orderType: OrderType,
    searchQueryDto: OrganizationSearchQueryDto
  ): Promise<JobCategoryPaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = searchQueryDto.by ? searchQueryDto.by : "name";
    const query: Prisma.JobCategoryFindManyArgs = {
      where: {
        // userId,
        [orderBy]: {
          contains: searchQueryDto.search
            ? searchQueryDto.search.toUpperCase()
            : "",
          mode: "insensitive",
        },
      },
    };

    const { page, limit } = pageLimit(paginationQuery);
    const total = await this.JobCategoryModel.count({
      where: query.where,
    });

    const pages = Math.ceil(total / limit);
    const startIndex = page < 1 ? 0 : (page - 1) * limit;

    const results = await this.JobCategoryModel.findMany({
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
