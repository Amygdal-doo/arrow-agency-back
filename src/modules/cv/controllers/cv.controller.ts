import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
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
import { CvService } from "../services/cv.service";
import { UserLogged } from "../../auth/decorators/user.decorator";
import { log } from "console";
import { ILoggedUserInfo } from "../../auth/interfaces/logged-user-info.interface";
import { FileInterceptor } from "@nestjs/platform-express";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { AccessTokenGuard } from "../../auth/guards/access-token.guard";
import { UploadDto } from "../../pdf/dtos/upload.dto";
import { UpdateCvDto } from "../dtos/requests/update/update_cv.body.dto";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import { CvResponseDto } from "../dtos/responses/cv.response.dto";

@ApiTags("cv")
@Controller("cv")
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Get("/:id")
  @ApiOperation({
    summary: "Get your cv",
    description: "Get a CV ",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({
    description: "CV found successfully",
    type: CvResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getCv(
    @UserLogged() loggedUserInfo: ILoggedUserInfo,
    @Param("id") id: string
  ) {
    return this.cvService.getCv(id, loggedUserInfo.id);
  }

  @Get("public/:id")
  @ApiOperation({
    summary: "Get Public cv",
    description: "Get a CV ",
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiOkResponse({
    description: "CV found successfully",
    type: CvResponseDto,
  })
  async getPublicCv(@Param("id") id: string) {
    return this.cvService.getPublicCv(id);
  }

  @Put("/:id")
  @ApiOperation({
    summary: "Update cv",
    description: "Update a CV ",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({
    description: "CV updated successfully",
    type: CvResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiBody({ type: UpdateCvDto })
  @Serialize(CvResponseDto)
  updateCv(
    @UserLogged() loggedUserInfo: ILoggedUserInfo,
    @Param("id") id: string,
    @Body() body: UpdateCvDto,
    @Query("templateId") templateId: string
  ) {
    return this.cvService.updateCv(loggedUserInfo.id, id, body, templateId);
  }
}
