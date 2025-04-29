interface Transaction {
  id: number;
  acquirer: string;
  order_number: string;
  amount: number;
  currency: string;
  outgoing_amount: number;
  outgoing_currency: string;
  approval_code: string;
  response_code: string;
  response_message: string;
  reference_number: string;
  systan: string;
  eci: string | null;
  xid: string | null;
  acsv: string | null;
  cc_type: string;
  status: "approved" | "declined" | "invalid";
  created_at: string;
  transaction_type: string;
  enrollment: string | null;
  authentication: string | null;
  pan_token: string;
  issuer: string;
  three_ds_version: string | null;
  payment_method: string | null;
}

interface TransactionResponse {
  transaction: Transaction;
}
