import { Customer } from "@prisma/client";
import { Subscription } from "rxjs";

export interface ISubPaymentParams {
  amount: number;
  currency: string;
  customer: Customer;
  pan_token: string;
  cit_id: string | null;
  order_number: string;
  plan_name: string;
}
