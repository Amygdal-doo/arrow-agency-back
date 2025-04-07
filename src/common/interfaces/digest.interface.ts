export interface IDigest {
  order_number: string;
  amount: string;
  currency: string;
}

export interface IReqDigest {
  merchantKey: string;
  authenticityToken: string;
  fullpath: string;
  timestamp: number; //new Date()).getTime()
  body: string;
}
export interface IDigestPayByLink {
  // order_number: string;
  // transaction_type: TransactionTypeEnum;
  merchant_key: string;
  authenticity_token: string;
  fullpath: string;
  body: string;
  timestamp: string;
  // amount: string;
  // currency: string;
}
