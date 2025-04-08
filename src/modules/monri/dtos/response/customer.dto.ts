import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CustomerResponseDto {
  @ApiProperty({ example: "4b281da4-d145-4233-b957-2018cf9aa0fb" })
  @Expose()
  uuid: string;

  @ApiProperty({ example: "customer-id-1234" })
  @Expose()
  merchant_customer_id: string;

  @ApiProperty({ example: "Customer" })
  @Expose()
  description: string;

  @ApiProperty({ example: "email@email.com" })
  @Expose()
  email: string;

  @ApiProperty({ example: "Test" })
  @Expose()
  name: string;

  @ApiPropertyOptional({ example: null })
  @Expose()
  phone?: string | null;

  @ApiProperty({ example: "approved" })
  @Expose()
  status: string;

  @ApiProperty({ example: false })
  @Expose()
  deleted: boolean;

  @ApiPropertyOptional({ example: null })
  @Expose()
  city?: string | null;

  @ApiProperty({ example: "BA" })
  @Expose()
  country: string;

  @ApiProperty({ example: "71000" })
  @Expose()
  zip_code: string;

  @ApiPropertyOptional({ example: null })
  @Expose()
  address?: string | null;

  @ApiProperty({ example: { key: "value" } })
  @Expose()
  metadata: Record<string, string>;

  @ApiProperty({ example: "2019-02-12T11:22:33Z" })
  @Expose()
  created_at: string;

  @ApiProperty({ example: "2019-02-12T11:22:33Z" })
  @Expose()
  updated_at: string;

  @ApiPropertyOptional({ example: null })
  @Expose()
  deleted_at?: string | null;
}
