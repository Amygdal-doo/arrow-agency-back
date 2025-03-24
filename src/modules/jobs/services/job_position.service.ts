import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateJobPositionDto } from "../dtos/requests/create-job_position.dto";
import { Prisma } from "@prisma/client";
import { SortOrder } from "src/common/enums/order.enum";
import {
  OrderType,
  OrganizationSearchQueryDto,
  PaginationQueryDto,
} from "src/common/dtos/pagination.dto";
import { pageLimit } from "src/common/helper/pagination.helper";
import { JobPositionPaginationResponseDto } from "../dtos/responses/job_position.response.dto";

@Injectable()
export class JobPositionService {
  constructor(private readonly databaseService: DatabaseService) {}
  private readonly logger: Logger = new Logger(JobPositionService.name);

  private readonly JobPositionModel = this.databaseService.jobPosition;

  async findName(name: string) {
    return this.databaseService.organization.findUnique({
      where: { name },
    });
  }

  async findCode(code: string) {
    return this.databaseService.organization.findUnique({
      where: { code },
    });
  }

  async create(data: CreateJobPositionDto) {
    data.code = data.code.toUpperCase();
    data.name = data.name.toUpperCase();

    const [name, code] = await Promise.all([
      this.findName(data.name),
      this.findCode(data.code),
    ]);
    if (name) throw new BadRequestException("Job Position name already exist");
    if (code) throw new BadRequestException("job Position code already exist");

    return this.JobPositionModel.create({ data });
  }

  async jobPositionSearchPaginated(
    paginationQuery: PaginationQueryDto,
    orderType: OrderType,
    searchQueryDto: OrganizationSearchQueryDto
  ): Promise<JobPositionPaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = searchQueryDto.by ? searchQueryDto.by : "name";
    const query: Prisma.JobPositionFindManyArgs = {
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
    const total = await this.JobPositionModel.count({
      where: query.where,
    });

    const pages = Math.ceil(total / limit);
    const startIndex = page < 1 ? 0 : (page - 1) * limit;

    const results = await this.JobPositionModel.findMany({
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
