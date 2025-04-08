import { MonriCurrency, Prisma } from "@prisma/client";
import { ILoggedUserInfo } from "src/modules/auth/interfaces/logged-user-info.interface";

export interface IPayByLinkArgs {
  jobId: string;
  amount: string;
  currency: MonriCurrency;
  loggedUserInfo?: ILoggedUserInfo;
  packageId?: string;
  tx?: Prisma.TransactionClient;
}
