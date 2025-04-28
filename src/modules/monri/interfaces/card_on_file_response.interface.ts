export interface ICardOnFileResponse {
  success: boolean;
  status: "approved" | "declined" | "invalid";
  message?: string;
  monriTransactionId?: number;
  rawResponse?: any; // optional: include full Monri response for logging/debug
}
