export interface ICreateCustomer {
  merchant_customer_id?: string;
  name?: string;
  description?: string;
  price?: number;
  phone?: string;
  metadata?: Record<string, string>;
  zip_code?: string;
  city?: string;
  address?: string;
  country?: string;
}
