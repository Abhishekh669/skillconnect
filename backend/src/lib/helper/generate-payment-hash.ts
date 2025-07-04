import * as crypto from "crypto";

export function generateEsewaSignature(
  totalAmount: string,
  transactionUuid: string,
  productCode: string,
  secretKey: string
): string {
  const data = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  
  if (!secretKey) {
    throw new Error("ESEWA_SECRET_KEY is required");
  }

  return crypto
    .createHmac("sha256", secretKey)
    .update(data)
    .digest("base64");
}