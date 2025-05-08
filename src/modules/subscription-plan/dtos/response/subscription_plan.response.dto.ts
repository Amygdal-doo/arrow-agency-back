import { ApiProperty } from "@nestjs/swagger";
import {
  MonriCurrency,
  SUBSCRIPTION_PERIOD,
  SubscriptionPlan,
} from "@prisma/client";
import { Decimal, JsonValue } from "@prisma/client/runtime/library";
import { Expose } from "class-transformer";

export class SubscriptionPlanResponseDto implements SubscriptionPlan {
  @ApiProperty({
    example: "1",
    description: "The ID of the Subscription Plan",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "Basic",
    description: "The name of the Subscription Plan",
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: "The basic subscription plan",
    description: "The description of the Subscription Plan",
  })
  @Expose()
  description: string;

  @ApiProperty({
    example: 9.99,
    description: "The price of the Subscription Plan",
  })
  @Expose()
  price: Decimal;

  @ApiProperty({
    example: MonriCurrency.EUR,
    description: "The currency of the Subscription Plan",
  })
  @Expose()
  currency: MonriCurrency;

  @ApiProperty({
    example: ["feature1", "feature2"],
    description: "The features of the Subscription Plan",
    required: false,
  })
  @Expose()
  features: JsonValue | null;

  @ApiProperty({
    example: SUBSCRIPTION_PERIOD.month,
    description: "The period of the Subscription Plan",
  })
  @Expose()
  period: SUBSCRIPTION_PERIOD;

  @ApiProperty({
    example: false,
    description: "Is the Subscription Plan default/free",
  })
  isDefault: boolean;

  @ApiProperty({
    example: "2023-02-01T12:00:00.000Z",
    description: "The creation date of the Subscription Plan",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2023-02-01T12:00:00.000Z",
    description: "The update date of the Subscription Plan",
  })
  @Expose()
  updatedAt: Date;
}
