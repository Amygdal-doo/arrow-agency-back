import {
  Body,
  Controller,
  Get,
  Logger,
  MaxFileSizeValidator,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { OrganizationService } from "../services/organization.service";

import { CreateOrganizationBodyDto } from "../dtos/requests/create-organization-body.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { AccessTokenGuard } from "src/modules/auth/guards/access-token.guard";
import { FileExtensionValidator } from "src/common/validators/file-extension-validators";
import {
  PaginationQueryDto,
  OrderType,
  SearchQueryDto,
} from "src/common/dtos/pagination.dto";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import {
  OrganizationPaginationResponseDto,
  OrganizationResponse,
} from "../dtos/responses/organization.response";
import { UserLogged } from "src/modules/auth/decorators/user.decorator";
import { ILoggedUserInfo } from "src/modules/auth/interfaces/logged-user-info.interface";

@ApiTags("Organization")
@Controller({ path: "organization" })
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  logger: Logger = new Logger(OrganizationController.name);

  @Post("create")
  // @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @UseGuards(AccessTokenGuard)
  @Serialize(OrganizationResponse)
  @ApiOkResponse()
  // @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    summary: "Create Organization - not logged in",
    description: "Create Organization/company not logged in",
  })
  async create(
    @Body() data: CreateOrganizationBodyDto,
    // @UserLogged() loggedUserInfo: ILoggedUserInfo,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileExtensionValidator({
            allowedExtensions: ["png", "jpg", "jpeg"],
          }),
        ],
        fileIsRequired: false,
      })
    )
    file?: Express.Multer.File | null
  ) {
    console.log({ data, file });

    if (!file) {
      return this.organizationService.createorganization(data, null);
    }

    return this.organizationService.createorganization(data, file);
  }

  @Post("create-logged-in")
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @Serialize(OrganizationResponse)
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    summary: "Create Organization - Logged In",
    description: "Create Organization/company logged in",
  })
  async createLoggedIn(
    @Body() data: CreateOrganizationBodyDto,
    @UserLogged() loggedUserInfo: ILoggedUserInfo,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileExtensionValidator({
            allowedExtensions: ["png", "jpg", "jpeg"],
          }),
        ],
        fileIsRequired: false,
      })
    )
    file?: Express.Multer.File | null
  ) {
    console.log({ data, file });

    if (!file) {
      return this.organizationService.createorganization(
        data,
        null,
        loggedUserInfo
      );
    }

    return this.organizationService.createorganization(
      data,
      file,
      loggedUserInfo
    );
  }

  @Get("all")
  @ApiOperation({
    summary: "Get all Organizations paginated ",
    description: "Fetches all Organizations",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard)
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(OrganizationPaginationResponseDto)
  @ApiOkResponse({ type: [OrganizationPaginationResponseDto] })
  async organizationsPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType
  ) {
    return this.organizationService.organizationsPaginated(
      paginationQuery,
      orderType
    );
  }

  @Get("me")
  @ApiOperation({
    summary: "Get all my Organizations paginated ",
    description: "Fetches all my Organizations",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard)
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(OrganizationPaginationResponseDto)
  @ApiOkResponse({ type: [OrganizationPaginationResponseDto] })
  async myOrganizationsPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType,
    @UserLogged() loggedUserInfo: ILoggedUserInfo
  ) {
    return this.organizationService.organizationsPaginated(
      paginationQuery,
      orderType,
      loggedUserInfo
    );
  }

  @Get("search")
  @ApiOperation({
    summary: "Get all Organizations paginated ",
    description: "Fetches all Organizations",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard)
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(OrganizationPaginationResponseDto)
  @ApiOkResponse({ type: [OrganizationPaginationResponseDto] })
  async organizationSearchPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType,
    @Query() searchQueryDto: SearchQueryDto
  ) {
    return this.organizationService.organizationsSearchPaginated(
      paginationQuery,
      orderType,
      searchQueryDto
    );
  }

  @Get("search/me")
  @ApiOperation({
    summary: "Get all My Organizations paginated ",
    description: "Fetches all Organizations",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard)
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(OrganizationPaginationResponseDto)
  @ApiOkResponse({ type: [OrganizationPaginationResponseDto] })
  async myOrganizationSearchPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType,
    @Query() searchQueryDto: SearchQueryDto,
    @UserLogged() loggedUserInfo: ILoggedUserInfo
  ) {
    return this.organizationService.organizationsSearchPaginated(
      paginationQuery,
      orderType,
      searchQueryDto,
      loggedUserInfo
    );
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get Organization by id",
    description: "",
  })
  // @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @Roles(Role.SUPER_ADMIN)
  // @UseGuards(AccessTokenGuard)
  // @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(OrganizationResponse)
  @ApiOkResponse({ type: OrganizationResponse })
  async getJob(@Query("id", ParseUUIDPipe) id: string) {
    return this.organizationService.getOrganization(id);
  }
}
