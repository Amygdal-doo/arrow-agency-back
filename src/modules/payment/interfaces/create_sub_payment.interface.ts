import { MonriCurrency, Prisma } from "@prisma/client";

export interface ICreateSubPayment {
  amount: string;
  currency: MonriCurrency;
  userId: string;
  tx?: Prisma.TransactionClient;
  planId: string;
}
