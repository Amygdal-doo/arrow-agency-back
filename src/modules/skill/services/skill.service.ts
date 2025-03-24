import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateSkillDto } from "../dtos/requests/create-skill.dto";
import { skillPaginationResponseDto } from "../dtos/responses/skill.response.dto";
import {
  OrderType,
  OrganizationSearchQueryDto,
  PaginationQueryDto,
  SkillSearchQueryDto,
} from "src/common/dtos/pagination.dto";
import { Prisma } from "@prisma/client";
import { SortOrder } from "src/common/enums/order.enum";
import { pageLimit } from "src/common/helper/pagination.helper";

@Injectable()
export class SkillService {
  constructor(private readonly databaseService: DatabaseService) {}

  logger: Logger = new Logger(SkillService.name);

  private readonly SkillModel = this.databaseService.skill;
  private readonly JobSkillModel = this.databaseService.jobSkill;

  async findName(name: string) {
    return this.SkillModel.findUnique({
      where: { name },
    });
  }

  async create(data: CreateSkillDto) {
    data.name = data.name.toUpperCase();
    const name = await this.findName(data.name);
    if (name) throw new BadRequestException("Skill name already exist");

    return this.SkillModel.create({ data });
  }

  async skillSearchPaginated(
    paginationQuery: PaginationQueryDto,
    orderType: OrderType,
    searchQueryDto: SkillSearchQueryDto
  ): Promise<skillPaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = "name";
    const query: Prisma.SkillFindManyArgs = {
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
    const total = await this.SkillModel.count({
      where: query.where,
    });

    const pages = Math.ceil(total / limit);
    const startIndex = page < 1 ? 0 : (page - 1) * limit;

    const results = await this.SkillModel.findMany({
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
