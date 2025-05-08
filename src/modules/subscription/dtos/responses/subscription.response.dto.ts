import { ApiProperty } from "@nestjs/swagger";
import { Subscription, SUBSCRIPTION_STATUS } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Exclude, Expose, Type } from "class-transformer";
import { SubscriptionPlanResponseDto } from "src/modules/monri/dtos/response/subscription_plan.response.dto";

export class SubscriptionResponseDto implements Subscription {
  @ApiProperty({
    example: "6f9a35c5-cc9e-4f4c-8e1c-5b0ce4f8c0de",
    description: "Subscription ID",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "1234567890",
    description: "Subscription Plan ID",
  })
  @Expose()
  planId: string;

  @ApiProperty({
    example: SUBSCRIPTION_STATUS.ACTIVE,
    description: "Subscription status",
  })
  @Expose()
  status: SUBSCRIPTION_STATUS;

  @ApiProperty({
    example: "2024-01-01T00:00:00.000Z",
    description: "Subscription start date",
  })
  @Expose()
  startDate: Date;

  @ApiProperty({
    example: null,
    description: "Next billing date",
  })
  @Expose()
  nextBillingDate: Date | null;

  @ApiProperty({
    example: "1234567890",
    description: "Monri subscription ID",
  })
  @Exclude()
  monriSubscriptionId: string | null;

  @ApiProperty({
    example: "6f9a35c5-cc9e-4f4c-8e1c-5b0ce4f8c0de",
    description: "Customer ID",
  })
  @Exclude()
  customerId: string;

  @ApiProperty({
    example: "1234567890",
    description: "Customer payment method token",
  })
  @Exclude()
  panToken: string;

  @ApiProperty({
    example: null,
    description: "Customer CIT ID",
  })
  @Exclude()
  cITId: string | null;

  @ApiProperty({
    example: "1000",
    description: "Ammount of the subscription in minor units",
  })
  @Expose()
  @Type(() => String)
  ammount: Decimal;

  @ApiProperty({
    example: false,
    description: "Customer cancelled subscription",
  })
  @Expose()
  customerCancelled: boolean;

  @ApiProperty({
    example: null,
    description: "Subscription end date",
  })
  @Expose()
  endDate: Date | null;

  @ApiProperty({
    example: null,
    description: "Trial start date",
  })
  @Expose()
  trialStartDate: Date | null;

  @ApiProperty({
    example: null,
    description: "Trial end date",
  })
  @Expose()
  trialEndDate: Date | null;

  @ApiProperty({
    example: null,
    description: "Subscription cancellation date",
  })
  @Expose()
  cancelledAt: Date | null;

  @ApiProperty({
    example: "2024-01-01T00:00:00.000Z",
    description: "Subscription creation date",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2024-01-01T00:00:00.000Z",
    description: "Subscription update date",
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    type: SubscriptionPlanResponseDto,
    description: "Subscription plan details",
  })
  @Expose()
  @Type(() => SubscriptionPlanResponseDto)
  plan: SubscriptionPlanResponseDto;
}
