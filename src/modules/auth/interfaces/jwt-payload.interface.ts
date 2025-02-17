import { ILoggedUserInfo } from './logged-user-info.interface';

export interface IJwtPayload extends ILoggedUserInfo {
  iat: number;
  exp: number;
}
