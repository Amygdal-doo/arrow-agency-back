import { Module } from "@nestjs/common";
import { SubscriptionPlanService } from "./subscription-plan.service";
import { SubscriptionPlanController } from "./subscription-plan.controller";
import { MonriModule } from "../monri/monri.module";

@Module({
  imports: [MonriModule],
  providers: [SubscriptionPlanService],
  controllers: [SubscriptionPlanController],
  exports: [SubscriptionPlanService],
})
export class SubscriptionPlanModule {}
