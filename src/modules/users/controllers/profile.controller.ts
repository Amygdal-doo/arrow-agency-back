import {
  Body,
  Controller,
  Get,
  Put,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import { UserLogged } from "../../auth/decorators/user.decorator";
import { AccessTokenGuard } from "../../auth/guards/access-token.guard";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { UserProfileResponseDto } from "../dtos/response/profile-response.dto";
import { ILoggedUserInfo } from "src/modules/auth/interfaces/logged-user-info.interface";
import { UpdateUserProfileDto } from "../dtos/requests/update-user-profile.dto";
import { UserProfileService } from "../services/user-profile.service";

@ApiTags("User Profile")
@Controller({ path: "user/profile" })
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get("")
  @ApiOperation({
    summary: "Get logged User Profile",
    description: "Get all neccesary information about logged user profile",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @Serialize(UserProfileResponseDto)
  @ApiOkResponse({ type: UserProfileResponseDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async me(@UserLogged() loggedUserInfo: ILoggedUserInfo) {
    return this.userProfileService.findByUserId(loggedUserInfo.id);
  }

  @Put("")
  @ApiOperation({
    summary: "Update logged User Profile",
    description: "Update information about logged user profile",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @Serialize(UserProfileResponseDto)
  @ApiOkResponse({ type: UserProfileResponseDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async update(
    @UserLogged() loggedUserInfo: ILoggedUserInfo,
    @Body() update: UpdateUserProfileDto
  ) {
    return this.userProfileService.updateOrCreate(loggedUserInfo.id, update);
  }
}
