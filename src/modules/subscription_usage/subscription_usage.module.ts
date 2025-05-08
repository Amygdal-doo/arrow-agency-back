import { Module } from "@nestjs/common";
import { SubscriptionUsageService } from "./subscription_usage.service";

@Module({
  providers: [SubscriptionUsageService],
  exports: [SubscriptionUsageService],
})
export class SubscriptionUsageModule {}
