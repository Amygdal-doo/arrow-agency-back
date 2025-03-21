import {
  Body,
  Controller,
  Logger,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
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
import { UserLogged } from "src/modules/auth/decorators/user.decorator";
import { ILoggedUserInfo } from "src/modules/auth/interfaces/logged-user-info.interface";
import { CompanyLogoSizeValidationPipe } from "src/modules/users/pipes/company-logo_size_validation.pipe";
import { ImageTypeValidationPipe } from "src/modules/users/pipes/image_type_validator.pipe";
import { CreateOrganizationBodyDto } from "../dtos/requests/create-organization-body.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { AccessTokenGuard } from "src/modules/auth/guards/access-token.guard";
import { uploadCompanyLogoDto } from "src/modules/users/dtos/requests/upload-logo.dto";
import { FileExtensionValidator } from "src/common/validators/file-extension-validators";

@ApiTags("Organization")
@Controller({ path: "organization" })
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  logger: Logger = new Logger(OrganizationController.name);

  @Post("create")
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  // @Serialize(SuccesfullUpdateDto)
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    summary: "Create Organization",
    description: "Create Organization/company",
  })
  async create(
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
    file?: Express.Multer.File
  ) {
    console.log({ data, file });

    if (!file) {
      return this.organizationService.createorganization(data, loggedUserInfo);
    }

    return this.organizationService.createorganization(
      data,
      loggedUserInfo,
      file
    );
  }
}
