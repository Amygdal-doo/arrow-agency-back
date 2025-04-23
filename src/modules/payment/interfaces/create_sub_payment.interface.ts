import { MonriCurrency, Prisma } from "@prisma/client";

export interface ICreateSubPayment {
  amount: string;
  currency: MonriCurrency;
  startDate: Date;
  // userId: string;
  customerId: string;
  tx?: Prisma.TransactionClient;
  planId: string;
}
