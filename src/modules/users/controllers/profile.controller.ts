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
import { UsersService } from "../services/users.service";
import { UpdateUserAndProfileDto } from "../dtos/requests/update-profile-and-user-info.dto";
import { SuccesfullUpdateDto } from "src/common/dtos/succesfull-update.dto";

@ApiTags("User Profile")
@Controller({ path: "user/profile" })
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly userService: UsersService
  ) {}

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
    summary: "Update logged User Profile an his first and last name",
    description: "Update information about logged user profile",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @Serialize(SuccesfullUpdateDto)
  @ApiOkResponse({ type: SuccesfullUpdateDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async update(
    @UserLogged() loggedUserInfo: ILoggedUserInfo,
    @Body() update: UpdateUserAndProfileDto
  ) {
    const profileUpdate: UpdateUserProfileDto = {
      address: update.address ? update.address : undefined,
      phoneNumber: update.phoneNumber ? update.phoneNumber : undefined,
    };
    await this.userProfileService.updateOrCreate(
      loggedUserInfo.id,
      profileUpdate
    );
    await this.userService.update(loggedUserInfo.id, {
      firstName: update.firstName ? update.firstName : undefined,
      lastName: update.lastName ? update.lastName : undefined,
    });
    return {
      message: "Updated successfully",
    };
  }
}
