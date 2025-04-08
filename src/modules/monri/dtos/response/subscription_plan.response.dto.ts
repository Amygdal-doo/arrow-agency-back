import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

// {
//     "id": 593,
//     "name": "Subscription #1",
//     "merchant_id": 11880,
//     "status": "approved",
//     "description": "Description",
//     "price": 1000,
//     "currency": "EUR",
//     "period": "week"
//   }
export class SubscriptionPlanResponseDto {
  @ApiProperty({ example: 1, description: "Subscription plan ID" })
  @Expose()
  id: number;

  @ApiProperty({
    example: "Subscription #1",
    description: "Subscription plan name",
  })
  @Expose()
  name: string;

  @ApiProperty({ example: 11880, description: "Merchant ID" })
  @Expose()
  merchant_id: number;

  @ApiProperty({ example: "approved", description: "Subscription plan status" })
  @Expose()
  status: string;

  @ApiProperty({
    example: "Description",
    description: "Subscription plan description",
  })
  @Expose()
  description: string;

  @ApiProperty({ example: 1000, description: "Subscription plan price" })
  @Expose()
  price: number;

  @ApiProperty({ example: "EUR", description: "Subscription plan currency" })
  @Expose()
  currency: string;

  @ApiProperty({ example: "week", description: "Subscription plan period" })
  @Expose()
  period: string;
}
