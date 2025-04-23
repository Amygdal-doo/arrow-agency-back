import { MonriCurrency, Prisma } from "@prisma/client";

export interface IPayByLinkArgs {
  jobId: string;
  amount: string;
  currency: MonriCurrency;
  // loggedUserInfo?: ILoggedUserInfo;
  customerId: string;
  packageId?: string;
  tx?: Prisma.TransactionClient;
}
