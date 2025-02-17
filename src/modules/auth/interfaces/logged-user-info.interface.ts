import { Role } from "@prisma/client";

export interface ILoggedUserInfo {
  id: string;
  email: string;
  role: Role;
}

export interface ILoggedUserInfoRefresh extends ILoggedUserInfo {
  refreshToken: string;
}
