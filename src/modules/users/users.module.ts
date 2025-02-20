import { Module } from "@nestjs/common";
import { UsersService } from "./services/users.service";
import { UserRefreshTokenService } from "./services/user-refresh-token.service";
import { UsersController } from "./controllers/users.controller";
import { UserProfileService } from "./services/user-profile.service";
import { UserProfileController } from "./controllers/profile.controller";

@Module({
  controllers: [UsersController, UserProfileController],
  providers: [UsersService, UserRefreshTokenService, UserProfileService],
  exports: [UsersService, UserRefreshTokenService, UserProfileService],
})
export class UsersModule {}
