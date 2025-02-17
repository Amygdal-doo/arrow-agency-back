import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserLogged } from '../auth/decorators/user.decorator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ILoggedUserInfo } from '../auth/interfaces/logged-user-info.interface';
import { UserResponseDto } from './dtos/response/user-response.dto';
import { UsersService } from './services/users.service';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get logged User',
    description: 'Get all neccesary information about logged user',
  })
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @Serialize(UserResponseDto)
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  me(@UserLogged() loggedUserInfoDto: ILoggedUserInfo) {
    return this.userService.getLoggedUser(loggedUserInfoDto.id);
  }
}
