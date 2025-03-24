import { Body, Controller, Get, Post, Query, UseFilters } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { SkillService } from "../services/skill.service";
import { CreateSkillDto } from "../dtos/requests/create-skill.dto";
import { skillPaginationResponseDto } from "../dtos/responses/skill.response.dto";
import { Skill } from "@prisma/client";
import {
  OrderType,
  PaginationQueryDto,
  SkillSearchQueryDto,
} from "src/common/dtos/pagination.dto";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import { JobCategoryResponseDto } from "src/modules/jobs/dtos/responses/job_category.response.dto";
import { JobPositionResponseDto } from "src/modules/jobs/dtos/responses/job_position.response.dto";

@ApiTags("Skill")
@Controller("skill")
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post("create")
  // @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @UseGuards(AccessTokenGuard)
  @Serialize(JobCategoryResponseDto)
  @ApiCreatedResponse({ description: "Created", type: JobPositionResponseDto })
  // @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiOperation({
    summary: "Create Skill",
    description: "Create Skill",
  })
  async create(
    @Body() data: CreateSkillDto
    // @UserLogged() loggedUserInfo: ILoggedUserInfo,
  ) {
    return this.skillService.create(data);
  }

  @Get("search")
  @ApiOperation({
    summary: "Get skill paginated with search",
    description: "",
  })
  // @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @Roles(Role.SUPER_ADMIN)
  // @UseGuards(AccessTokenGuard)
  // @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(skillPaginationResponseDto)
  @ApiOkResponse({ type: [skillPaginationResponseDto] })
  async organizationSearchPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType,
    @Query() searchQueryDto: SkillSearchQueryDto
  ) {
    return this.skillService.skillSearchPaginated(
      paginationQuery,
      orderType,
      searchQueryDto
    );
  }
}
