import { Body, Controller, Get, Post, Query, UseFilters } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JobPositionService } from "../services/job_position.service";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { CreateJobPositionDto } from "../dtos/requests/create-job_position.dto";
import {
  JobPositionPaginationResponseDto,
  JobPositionResponseDto,
} from "../dtos/responses/job_position.response.dto";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import {
  PaginationQueryDto,
  OrderType,
  OrganizationSearchQueryDto,
} from "src/common/dtos/pagination.dto";

@ApiTags("Job Position")
@Controller("job-position")
export class JobPositionController {
  constructor(private readonly jobPositionService: JobPositionService) {}

  @Post("create")
  // @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @UseGuards(AccessTokenGuard)
  @Serialize(JobPositionResponseDto)
  @ApiCreatedResponse({ description: "Created", type: JobPositionResponseDto })
  // @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiOperation({
    summary: "Create Job position",
    description: "Create Job position",
  })
  async create(
    @Body() data: CreateJobPositionDto
    // @UserLogged() loggedUserInfo: ILoggedUserInfo,
  ) {
    return this.jobPositionService.create(data);
  }

  @Get("search")
  @ApiOperation({
    summary: "Get Job Position paginated with search",
    description: "",
  })
  // @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @Roles(Role.SUPER_ADMIN)
  // @UseGuards(AccessTokenGuard)
  // @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(JobPositionPaginationResponseDto)
  @ApiOkResponse({ type: [JobPositionPaginationResponseDto] })
  async jobPositionSearchPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType,
    @Query() searchQueryDto: OrganizationSearchQueryDto
  ) {
    return this.jobPositionService.jobPositionSearchPaginated(
      paginationQuery,
      orderType,
      searchQueryDto
    );
  }
}
