import { Body, Controller, Get, Post, Query, UseFilters } from "@nestjs/common";
import { JobsService } from "../services/jobs.service";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CreateJobDto } from "../dtos/requests/create-job.dto";
import {
  JobPaginationResponseDto,
  JobResponseDto,
} from "../dtos/responses/job.response.dto";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import {
  OrderType,
  PaginationQueryDto,
  SearchQueryDto,
} from "src/common/dtos/pagination.dto";

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
    summary: "Create Job",
    description: "Create Job",
  })
  async create(
    @Body() data: CreateJobDto
    // @UserLogged() loggedUserInfo: ILoggedUserInfo,
  ) {
    return this.jobsService.create(data);
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
  // @Serialize(JobPaginationResponseDto)
  @ApiOkResponse({ type: [JobPaginationResponseDto] })
  async organizationSearchPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType
  ) {
    return this.jobsService.jobsPaginated(paginationQuery, orderType);
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
    @Query() searchQueryDto: SearchQueryDto
  ) {
    return this.jobsService.jobSearchPaginated(
      paginationQuery,
      orderType,
      searchQueryDto
    );
  }
}
