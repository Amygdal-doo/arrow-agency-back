import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserLogged } from './decorators/user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalLoginDto } from './dtos/local-login.dto';
import { LoginResponseDto } from './dtos/responses/login-response.dto';
import {
  ILoggedUserInfo,
  ILoggedUserInfoRefresh,
} from './interfaces/logged-user-info.interface';
import { AuthService } from './auth.service';
import { LocalRegisterBodyDto } from './dtos/local-register-body.dto';
import { UserResponseDto } from '../users/dtos/response/user-response.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // LOCAL REGISTER AND LOGIN
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LocalLoginDto })
  @UseFilters(new HttpExceptionFilter())
  @HttpCode(200)
  @ApiOperation({
    summary: 'User login',
    description: 'Login to you account using email and password',
  })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiForbiddenResponse()
  async login(@UserLogged() user: ILoggedUserInfo) {
    return await this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register new user - only registers you as user role',
  })
  @ApiBody({ type: LocalRegisterBodyDto })
  @UseFilters(new HttpExceptionFilter())
  @Serialize(UserResponseDto)
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse()
  async register(@Body() localRegisterBodyDto: LocalRegisterBodyDto) {
    const user = await this.authService.register(localRegisterBodyDto);
    // send email
    return user;
  }

  @Get('refresh')
  @ApiOperation({
    summary: 'Generates new Tokens for the user',
  })
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('Access Token')
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse()
  refreshTokensGet(
    @UserLogged() loggedUserInfoRefreshDto: ILoggedUserInfoRefresh,
  ) {
    const { refreshToken, ...loggedUserInfoDto } = loggedUserInfoRefreshDto;
    return this.authService.refreshTokens(loggedUserInfoDto, refreshToken);
  }
}
