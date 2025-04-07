import * as crypto from "crypto";
import { IDigestPayByLink } from "../interfaces/digest.interface";

export function calculateDigestPayByLink(data: IDigestPayByLink): string {
  const {
    // order_number,
    // amount,
    // currency,
    merchant_key,
    fullpath,
    body,
    timestamp,
    authenticity_token,
  } = data;
  // const rawData = `${merchant_key}${timestamp}${authenticity_token}${fullpath}${body}${order_number}${amount}${currency}`;
  const rawData = `${merchant_key}${timestamp}${authenticity_token}${fullpath}${body}`;
  return crypto.createHash("sha512").update(rawData).digest("hex");
}
