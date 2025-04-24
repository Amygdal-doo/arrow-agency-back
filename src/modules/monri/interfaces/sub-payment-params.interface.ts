import { Customer } from "@prisma/client";
import { Subscription } from "rxjs";

export interface ISubPaymentParams {
  amount: number;
  currency: string;
  customer: Customer;
  pan_token: string;
  order_number: string;
  plan_name: string;
}
