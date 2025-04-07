import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  IsDateString,
  IsArray,
} from "class-validator";

export class PaymentCallbackDto {
  @ApiProperty({
    example: 892477,
    description: "Unique identifier for the payment.",
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ example: "xml-sim", description: "Acquirer name." })
  @IsNotEmpty()
  @IsString()
  acquirer: string;

  @ApiProperty({
    example: "26fb5017-3ba9-4317-ad69-dfc7ffc94470",
    description: "Unique order number.",
  })
  @IsNotEmpty()
  @IsString()
  order_number: string;

  @ApiProperty({
    example: "Order info",
    description: "Additional order information.",
  })
  @IsNotEmpty()
  @IsString()
  order_info: string;

  @ApiProperty({
    example: 1000,
    description: "Payment amount in the smallest currency unit.",
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: "USD",
    description: "Currency code for the payment.",
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({ example: "wab razi", description: "Cardholder full name." })
  @IsNotEmpty()
  @IsString()
  ch_full_name: string;

  @ApiProperty({
    example: 1000,
    description: "Outgoing amount in the smallest currency unit.",
  })
  @IsNotEmpty()
  @IsNumber()
  outgoing_amount: number;

  @ApiProperty({ example: "USD", description: "Outgoing currency code." })
  @IsNotEmpty()
  @IsString()
  outgoing_currency: string;

  @ApiProperty({
    example: "824478",
    description: "Approval code for the transaction.",
  })
  @IsNotEmpty()
  @IsString()
  approval_code: string;

  @ApiProperty({
    example: "0000",
    description: "Response code from the payment gateway.",
  })
  @IsNotEmpty()
  @IsString()
  response_code: string;

  @ApiProperty({
    example: "transaction approved",
    description: "Response message from the payment gateway.",
  })
  @IsNotEmpty()
  @IsString()
  response_message: string;

  @ApiProperty({
    example: "121373",
    description: "Reference number for the transaction.",
  })
  @IsNotEmpty()
  @IsString()
  reference_number: string;

  @ApiProperty({
    example: "892477",
    description: "System Transaction ID (systan).",
  })
  @IsNotEmpty()
  @IsString()
  systan: string;

  @ApiProperty({
    example: null,
    description: "Electronic Commerce Indicator (ECI).",
  })
  @IsOptional()
  @IsString()
  eci: string | null;

  @ApiProperty({
    example: null,
    description: "Transaction ID for 3D Secure (XID).",
  })
  @IsOptional()
  @IsString()
  xid: string | null;

  @ApiProperty({
    example: null,
    description: "Additional card security value (ACSV).",
  })
  @IsOptional()
  @IsString()
  acsv: string | null;

  @ApiProperty({
    example: "master",
    description: "Card type (e.g., master, visa).",
  })
  @IsNotEmpty()
  @IsString()
  cc_type: string;

  @ApiProperty({ example: "approved", description: "Transaction status." })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({
    example: "2025-01-14T16:44:43.480+01:00",
    description: "Timestamp of transaction creation.",
  })
  @IsNotEmpty()
  @IsDateString()
  created_at: string;

  @ApiProperty({
    example: "purchase",
    description: "Type of transaction (e.g., purchase, refund).",
  })
  @IsNotEmpty()
  @IsString()
  transaction_type: string;

  @ApiProperty({
    example: null,
    description: "Enrollment status of 3D Secure.",
  })
  @IsOptional()
  @IsString()
  enrollment: string | null;

  @ApiProperty({
    example: null,
    description: "Authentication status of 3D Secure.",
  })
  @IsOptional()
  @IsString()
  authentication: string | null;

  @ApiProperty({ example: null, description: "PAN token for the card." })
  @IsOptional()
  @IsString()
  pan_token: string | null;

  @ApiProperty({
    example: "wabyrazi@asciibinder.net",
    description: "Cardholder email address.",
  })
  @IsNotEmpty()
  @IsEmail()
  ch_email: string;

  @ApiProperty({
    example: "546400-xxx-xxx-0008",
    description: "Masked PAN (Primary Account Number).",
  })
  @IsNotEmpty()
  @IsString()
  masked_pan: string;

  @ApiProperty({
    example: "off-us",
    description: "Issuer type (e.g., on-us, off-us).",
  })
  @IsNotEmpty()
  @IsString()
  issuer: string;

  @ApiProperty({
    example: null,
    description: "Number of installments (if applicable).",
  })
  @IsOptional()
  @IsNumber()
  number_of_installments: number | null;

  @ApiProperty({
    example: null,
    description: "Custom parameters for the transaction.",
  })
  @IsOptional()
  custom_params: any;

  @ApiProperty({
    example: "3312",
    description: "Expiration date of the card (MMYY format).",
  })
  @IsNotEmpty()
  @IsString()
  expiration_date: string;

  @ApiProperty({
    example: [],
    description: "Issuer groups associated with the card.",
  })
  @IsOptional()
  @IsArray()
  issuer_groups: string[];

  @ApiProperty({ example: null, description: "CIT ID for the transaction." })
  @IsOptional()
  @IsString()
  cit_id: string | null;
}
