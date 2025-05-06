import { Role } from "@prisma/client";

export interface ILoggedUserInfo {
  id: string;
  email: string;
  role: Role;
  subId: string | null;
  //subscription: Subscription;
}

export interface ILoggedUserInfoRefresh extends ILoggedUserInfo {
  refreshToken: string;
}
