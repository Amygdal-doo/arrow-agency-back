import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { JobsService } from "../services/jobs.service";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CreateJobDto } from "../dtos/requests/create-job.dto";
import {
  JobPaginationResponseDto,
  JobResponseDto,
} from "../dtos/responses/job.response.dto";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import {
  JobSearchQueryDto,
  OrderType,
  PaginationQueryDto,
  SearchQueryDto,
} from "src/common/dtos/pagination.dto";
import { UserLogged } from "src/modules/auth/decorators/user.decorator";
import { AccessTokenGuard } from "src/modules/auth/guards/access-token.guard";
import { ILoggedUserInfo } from "src/modules/auth/interfaces/logged-user-info.interface";
import { PermissionsGuard } from "src/modules/auth/permission-guard/permissions.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

@ApiTags("jobs")
@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post("create")
  // @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @UseGuards(AccessTokenGuard)
  @Serialize(JobResponseDto)
  @ApiCreatedResponse({ description: "Created", type: JobResponseDto })
  // @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiOperation({
    summary: "Create Job - Not Logged",
    description: "Create Job - Not Logged",
  })
  async create(
    @Body() data: CreateJobDto
    // @UserLogged() loggedUserInfo: ILoggedUserInfo,
  ) {
    return this.jobsService.create(data);
  }

  @Post("create-logged-in")
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @Serialize(JobResponseDto)
  @ApiCreatedResponse({ description: "Created", type: JobResponseDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiOperation({
    summary: "Create Job- Logged",
    description: "Create Job - Logged",
  })
  async createLoggedIn(
    @Body() data: CreateJobDto,
    @UserLogged() loggedUserInfo: ILoggedUserInfo
  ) {
    return this.jobsService.create(data, loggedUserInfo);
  }

  @Get("")
  @ApiOperation({
    summary: "Get Job paginated",
    description: "",
  })
  // @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @Roles(Role.SUPER_ADMIN)
  // @UseGuards(AccessTokenGuard)
  // @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(JobPaginationResponseDto)
  @ApiOkResponse({ type: [JobPaginationResponseDto] })
  async organizationSearchPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType
  ) {
    return this.jobsService.jobsPaginated(paginationQuery, orderType);
  }

  @Get("/all")
  @ApiOperation({
    summary: "Get Job paginated - Super Admin",
    description: "JOb status published and Draft ",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(JobPaginationResponseDto)
  @ApiOkResponse({ type: [JobPaginationResponseDto] })
  async organizationPaginatedAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType
  ) {
    return this.jobsService.jobsPaginatedAll(paginationQuery, orderType);
  }

  @Get("me")
  @ApiOperation({
    summary: "Get my Jobs paginated",
    description: "",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard)
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(JobPaginationResponseDto)
  @ApiOkResponse({ type: [JobPaginationResponseDto] })
  async myOrganizationSearchPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType,
    @UserLogged() loggedUserInfo: ILoggedUserInfo
  ) {
    return this.jobsService.jobsPaginated(
      paginationQuery,
      orderType,
      loggedUserInfo
    );
  }

  @Get("search")
  @ApiOperation({
    summary: "Get Job  paginated with search",
    description: "",
  })
  // @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @Roles(Role.SUPER_ADMIN)
  // @UseGuards(AccessTokenGuard)
  // @ApiUnauthorizedResponse({ description: "Unauthorized" })
  // @Serialize(JobPaginationResponseDto)
  @ApiOkResponse({ type: [JobPaginationResponseDto] })
  async jobSearchPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType,
    @Query() jobSearchQueryDto: JobSearchQueryDto
  ) {
    return this.jobsService.jobSearchPaginated(
      paginationQuery,
      orderType,
      jobSearchQueryDto
    );
  }

  @Get("search/me")
  @ApiOperation({
    summary: "Get my Job paginated with search",
    description: "",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard)
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(JobPaginationResponseDto)
  @ApiOkResponse({ type: [JobPaginationResponseDto] })
  async MYJobSearchPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType,
    @Query() jobSearchQueryDto: JobSearchQueryDto,
    @UserLogged() loggedUserInfo: ILoggedUserInfo
  ) {
    return this.jobsService.jobSearchPaginated(
      paginationQuery,
      orderType,
      jobSearchQueryDto,
      loggedUserInfo
    );
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get Job by id",
    description: "",
  })
  // @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @Roles(Role.SUPER_ADMIN)
  // @UseGuards(AccessTokenGuard)
  // @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(JobResponseDto)
  @ApiOkResponse({ type: JobResponseDto })
  async getJob(@Query("id", ParseUUIDPipe) id: string) {
    return this.jobsService.getJob(id);
  }
}
