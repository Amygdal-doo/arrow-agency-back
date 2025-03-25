import { Body, Controller, Get, Post, Query, UseFilters } from "@nestjs/common";
import { JobsService } from "../services/jobs.service";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JobCategoryService } from "../services/job_category.service";
import {
  PaginationQueryDto,
  OrderType,
  OrganizationSearchQueryDto,
} from "src/common/dtos/pagination.dto";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import { CreateJobPositionDto } from "../dtos/requests/create-job_position.dto";
import {
  JobCategoryPaginationResponseDto,
  JobCategoryResponseDto,
} from "../dtos/responses/job_category.response.dto";
import { JobPositionResponseDto } from "../dtos/responses/job_position.response.dto";

@ApiTags("Job Category")
@Controller("job-category")
export class JobCategoryController {
  constructor(private readonly jobCategoryService: JobCategoryService) {}

  @Post("create")
  // @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @UseGuards(AccessTokenGuard)
  @Serialize(JobCategoryResponseDto)
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
    return this.jobCategoryService.create(data);
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
  @Serialize(JobCategoryPaginationResponseDto)
  @ApiOkResponse({ type: [JobCategoryPaginationResponseDto] })
  async jonCategorySearchPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType,
    @Query() searchQueryDto: OrganizationSearchQueryDto
  ) {
    return this.jobCategoryService.jobCategorySearchPaginated(
      paginationQuery,
      orderType,
      searchQueryDto
    );
  }
}
