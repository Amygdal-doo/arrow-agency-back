/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { UsersService } from "src/modules/users/services/users.service";
import { ILoggedUserInfo } from "../interfaces/logged-user-info.interface";
import { SUBSCRIPTION_STATUS } from "@prisma/client";

// type JwtPayload = {
//   sub: string;
//   username: string;
// };

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    config: ConfigService,
    private readonly userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>("JWT_ACCESS_SECRET"), //JWT_SECRET
      signOptions: {
        expiresIn: config.get<string>("EXPIRES_IN"),
      },
    });
  }

  async validate(payload: IJwtPayload): Promise<ILoggedUserInfo> {
    const user = await this.userService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException("User not found or token invalid");
    }

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
}
