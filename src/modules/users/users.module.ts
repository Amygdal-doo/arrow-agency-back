import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { UserRefreshTokenService } from './services/user-refresh-token.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRefreshTokenService],
  exports: [UsersService, UserRefreshTokenService],
})
export class UsersModule {}
