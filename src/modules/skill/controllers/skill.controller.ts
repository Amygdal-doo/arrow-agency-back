import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { SkillService } from "../services/skill.service";
import { CreateSkillDto } from "../dtos/requests/create-skill.dto";
import {
  skillPaginationResponseDto,
  SkillResponseDto,
} from "../dtos/responses/skill.response.dto";
import { Role, Skill } from "@prisma/client";
import {
  OrderType,
  PaginationQueryDto,
  SearchQueryDto,
} from "src/common/dtos/pagination.dto";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import { JobCategoryResponseDto } from "src/modules/jobs/dtos/responses/job_category.response.dto";
import { UserLogged } from "src/modules/auth/decorators/user.decorator";
import { AccessTokenGuard } from "src/modules/auth/guards/access-token.guard";
import { ILoggedUserInfo } from "src/modules/auth/interfaces/logged-user-info.interface";
import { PermissionsGuard } from "src/modules/auth/permission-guard/permissions.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";

@ApiTags("Skill")
@Controller("skill")
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post("create")
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Serialize(JobCategoryResponseDto)
  @ApiCreatedResponse({ description: "Created", type: SkillResponseDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiOperation({
    summary: "Create Skill - only Super Admin",
    description: "Create Skill",
  })
  async create(
    @Body() data: CreateSkillDto,
    @UserLogged() loggedUserInfo: ILoggedUserInfo
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
    @Query() searchQueryDto: SearchQueryDto
  ) {
    return this.skillService.skillSearchPaginated(
      paginationQuery,
      orderType,
      searchQueryDto
    );
  }
}
