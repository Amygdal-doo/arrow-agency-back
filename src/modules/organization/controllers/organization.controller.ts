import {
  Body,
  Controller,
  Get,
  Logger,
  MaxFileSizeValidator,
  ParseFilePipe,
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
  OrganizationSearchQueryDto,
} from "src/common/dtos/pagination.dto";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import {
  OrganizationPaginationResponseDto,
  OrganizationResponse,
} from "../dtos/responses/organization.response";

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
    summary: "Create Organization",
    description: "Create Organization/company",
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
    file?: Express.Multer.File
  ) {
    console.log({ data, file });

    if (!file) {
      return this.organizationService.createorganization(data);
    }

    return this.organizationService.createorganization(data, file);
  }

  @Get("all")
  @ApiOperation({
    summary: "Get all Organizations paginated ",
    description: "Fetches all Organizations",
  })
  // @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  // @Roles(Role.SUPER_ADMIN)
  // @UseGuards(AccessTokenGuard)
  // @ApiUnauthorizedResponse({ description: "Unauthorized" })
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
    @Query() organizationSearchQueryDto: OrganizationSearchQueryDto
  ) {
    return this.organizationService.organizationsSearchPaginated(
      paginationQuery,
      orderType,
      organizationSearchQueryDto
    );
  }
}
