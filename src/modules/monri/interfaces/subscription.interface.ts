import { MonriCurrency, SUBSCRIPTION_PERIOD } from "@prisma/client";

export interface ISubscription {
  name: string;
  description: string;
  price: number;
  currency: MonriCurrency;
  period: SUBSCRIPTION_PERIOD;
}
