import * as crypto from "crypto";
import { IDigest, IReqDigest } from "../interfaces/digest.interface";

export function calculateDigest(key: string, data: IDigest): string {
  const { order_number, amount, currency } = data;
  const rawData = `${key}${order_number}${amount}${currency}`;
  return crypto.createHash("sha512").update(rawData).digest("hex");
}

export function reqDigest(data: IReqDigest): string {
  const { merchantKey, authenticityToken, timestamp, fullpath, body } = data;
  const rawData = `${merchantKey}${timestamp}${authenticityToken}${fullpath}${body}`;
  return crypto.createHash("sha512").update(rawData).digest("hex");
}
