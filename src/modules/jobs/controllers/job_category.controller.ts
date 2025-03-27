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
  SearchQueryDto,
} from "src/common/dtos/pagination.dto";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import {
  JobCategoryPaginationResponseDto,
  JobCategoryResponseDto,
} from "../dtos/responses/job_category.response.dto";
import { CreateJobCategoryDto } from "../dtos/requests/create-jog_category.dto";

@ApiTags("Job Category")
@Controller("job-category")
export class JobCategoryController {
  constructor(private readonly jobCategoryService: JobCategoryService) {}

  @Post("create")
  // @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @UseGuards(AccessTokenGuard)
  @Serialize(JobCategoryResponseDto)
  @ApiCreatedResponse({ description: "Created", type: JobCategoryResponseDto })
  // @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiOperation({
    summary: "Create Job Category",
    description: "Create Job Category",
  })
  async create(
    @Body() data: CreateJobCategoryDto
    // @UserLogged() loggedUserInfo: ILoggedUserInfo,
  ) {
    return this.jobCategoryService.create(data);
  }

  @Get("search")
  @ApiOperation({
    summary: "Get Job Category paginated with search",
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
    @Query() searchQueryDto: SearchQueryDto
  ) {
    return this.jobCategoryService.jobCategorySearchPaginated(
      paginationQuery,
      orderType,
      searchQueryDto
    );
  }
}
