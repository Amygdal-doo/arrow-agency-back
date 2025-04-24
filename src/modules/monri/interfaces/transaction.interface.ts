export interface MonriTransaction {
  transaction_type: "authorize" | "purchase" | string;
  amount: number;
  ip?: string;
  order_info: string;
  ch_address: string;
  ch_city: string;
  ch_country: string;
  ch_email: string;
  ch_full_name: string;
  ch_phone: string;
  ch_zip: string;
  currency: string;
  digest: string;
  order_number: string;
  authenticity_token: string;
  language: string;
  pan_token: string;
  moto: boolean;
}

export interface MonriTransactionRequest {
  transaction: MonriTransaction;
}
