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
