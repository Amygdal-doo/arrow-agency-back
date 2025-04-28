import { MonriCurrency, Prisma } from "@prisma/client";

export interface ICreateInitSubPayment {
  amount: string;
  currency: MonriCurrency;
  startDate: Date;
  // userId: string;
  customerId: string;
  tx?: Prisma.TransactionClient;
  planId: string;
}

export interface ICreateSubPayment {
  amount: string;
  currency: MonriCurrency;
  customerId: string;
  subscriptionId: string;
  tx?: Prisma.TransactionClient;
}
