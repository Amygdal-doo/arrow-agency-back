import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Response,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { ApplicantService } from "./applicant.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { UserLogged } from "../auth/decorators/user.decorator";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { ILoggedUserInfo } from "../auth/interfaces/logged-user-info.interface";
import { UploadDto } from "../pdf/dtos/upload.dto";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import {
  ApplicantPaginationResponseDto,
  ApplicantResponseDto,
} from "./dtos/applicant.response.dto";
import { PermissionsGuard } from "../auth/permission-guard/permissions.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "@prisma/client";
import {
  PaginationQueryDto,
  OrderType,
  ApplicantsBytechnologiesDto,
} from "src/common/dtos/pagination.dto";

@ApiTags("Applicant")
@Controller("applicant")
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Get()
  @ApiOperation({
    summary: "Get all your applicants paginated - user",
    description: "Fetches all applicants based on the logged user",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(ApplicantPaginationResponseDto)
  @ApiOkResponse({ type: [ApplicantResponseDto] })
  async GetAllYourApplicants(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType,
    @UserLogged() loggedUserInfo: ILoggedUserInfo,
    @Query() applicantsBytechnologiesDto: ApplicantsBytechnologiesDto
  ) {
    return this.applicantService.userApplicantsPaginated(
      loggedUserInfo.id,
      paginationQuery,
      orderType,
      applicantsBytechnologiesDto
    );
  }

  @Get("all")
  @ApiOperation({
    summary: "Get all applicants paginated - Super Admin",
    description: "Fetches all applicants for super admin",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(ApplicantPaginationResponseDto)
  @ApiOkResponse({ type: [ApplicantResponseDto] })
  async GetAllApplicants(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType
  ) {
    return this.applicantService.findAllApplicantsPaginated(
      paginationQuery,
      orderType
    );
  }

  // @Get("/cv/:id")
  // @ApiOperation({
  //   summary: "Generate Pdf file from existing cv",
  //   description: "Upload a CV in PDF format",
  // })
  // @ApiBearerAuth("Access Token")
  // @UseFilters(new HttpExceptionFilter())
  // @UseGuards(AccessTokenGuard)
  // @ApiOkResponse({ description: "Pdf File generated" })
  // @ApiUnauthorizedResponse({ description: "Unauthorized" })
  // async getApplicantCvById(
  //   @Param("id") id: string,
  //   @UserLogged() loggedUserInfo: ILoggedUserInfo,
  //   @Response() res: any
  // ) {
  //   const pdfBuffer = await this.applicantService.getApplicantCvById(
  //     loggedUserInfo,
  //     id
  //   );

  //   res.set({
  //     "Content-Type": "application/pdf",
  //     "Content-Disposition": `attachment; filename="cv-${id}.pdf"`,
  //     "Content-Length": pdfBuffer.length,
  //   });
  //   res.end(pdfBuffer);
  // }

  @Post("cv")
  @ApiOperation({
    summary: "Upload a pdf file",
    description: "Upload a CV in PDF format",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @ApiCreatedResponse({ description: "CV created successfully" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @ApiBody({ type: UploadDto })
  async cv(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB limit
          new FileTypeValidator({ fileType: "application/pdf" }),
        ],
      })
    )
    file: Express.Multer.File,
    @Body() body: UploadDto, // Extract text data
    @UserLogged() loggedUserInfo: ILoggedUserInfo,
    @Response() res: any
  ) {
    const pdfBuffer = await this.applicantService.generatePdfAndSave(
      loggedUserInfo,
      file,
      body
    );

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="cv-${body.name}_${body.surname}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }
}
