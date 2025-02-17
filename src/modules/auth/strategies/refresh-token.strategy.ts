/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/modules/users/services/users.service";
import { ILoggedUserInfoRefresh } from "../interfaces/logged-user-info.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh"
) {
  constructor(
    config: ConfigService,
    private readonly userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>("JWT_REFRESH_SECRET"), //JWT_SECRET
      signOptions: {
        expiresIn: config.get<string>("REFRESH_TOKEN_EXPIRES_IN"),
      },
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: IJwtPayload
  ): Promise<ILoggedUserInfoRefresh> {
    const user = await this.userService.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException("User not found or token invalid");
    }

    const refreshToken = req.get("Authorization")?.replace("Bearer", "").trim();
    if (!refreshToken) throw new ForbiddenException("Refresh token malformed");

    // Update user props if changes have been made ß
    payload.role = user?.role;
    payload.email = user?.email;

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      refreshToken,
    };
  }
}
