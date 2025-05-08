import { ForbiddenException, Injectable } from "@nestjs/common";
import { UserRefreshTokenService } from "../users/services/user-refresh-token.service";
import { UsersService } from "../users/services/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ILoggedUserInfo } from "./interfaces/logged-user-info.interface";
import { LoginResponseDto } from "./dtos/responses/login-response.dto";
import { Prisma, SUBSCRIPTION_STATUS } from "@prisma/client";
import { ExistingUserException } from "src/common/exceptions/errors/user/existing-user.exception";
import { ExistingUsernameException } from "src/common/exceptions/errors/user/existing-username.exception";
import {
  hashPassword,
  verifyPassword,
} from "src/common/helper/hash-password.helper";
import { WrongCredidentialsException } from "src/common/exceptions/errors/auth/wrong-credidentials.exception";
import { PaymentService } from "../payment/payment.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly userRefreshTokenService: UserRefreshTokenService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly paymentService: PaymentService
  ) {}

  async getAccessAndRefreshTokens(
    payload: ILoggedUserInfo
  ): Promise<LoginResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
        expiresIn: this.configService.get<string>("EXPIRES_IN"),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
        expiresIn: this.configService.get<string>("REFRESH_TOKEN_EXPIRES_IN"),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
  async register(data: Prisma.UserCreateInput) {
    const emailExist = await this.userService.findByEmail(data.email);
    if (emailExist) throw new ExistingUserException();

    const hashedPw = hashPassword(data.password);

    data.password = hashedPw;

    const user = await this.userService.create(data);

    await this.paymentService.createDefaultSubscription(user.id);

    return user;
  }
  async validateUser(
    email: string,
    password: string
  ): Promise<ILoggedUserInfo> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new WrongCredidentialsException();

    const isMatch = verifyPassword(user.password, password);
    if (!isMatch) throw new WrongCredidentialsException();

    //maybe check for update in role ?
    const subId =
      user.customer?.subscriptions?.find(
        (sub) => sub.status === SUBSCRIPTION_STATUS.ACTIVE
      )?.id || null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      subId,
    };
  }
  async login(payload: ILoggedUserInfo): Promise<LoginResponseDto> {
    const tokens = await this.getAccessAndRefreshTokens(payload);
    await this.updateRefreshToken(payload.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    const hashedRefreshToken = hashPassword(refreshToken);
    await this.userRefreshTokenService.updateRefreshToken(
      userId,
      hashedRefreshToken
    );
  }

  async refreshTokens(
    loggedUserInfoDto: ILoggedUserInfo,
    refreshToken: string
  ) {
    const refreshTk = await this.userRefreshTokenService.findByUserId(
      loggedUserInfoDto.id
    );
    if (!refreshTk) throw new ForbiddenException("Access Denied"); // 403 Forbidden

    const refreshTokenMatches = verifyPassword(refreshTk.token, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException("Access Denied"); // 403 Forbidden
    const tokens = await this.getAccessAndRefreshTokens(loggedUserInfoDto);
    await this.updateRefreshToken(loggedUserInfoDto.id, tokens.refreshToken);
    return tokens;
  }
}
