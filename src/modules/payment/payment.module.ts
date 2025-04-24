import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { JobsModule } from "../jobs/jobs.module";
import { OrganizationModule } from "../organization/organization.module";
import { PackageModule } from "../package/package.module";
import { SubscriptionPlanModule } from "../subscription-plan/subscription-plan.module";
import { UsersModule } from "../users/users.module";
import { SubscriptionModule } from "../subscription/subscription.module";
import { CustomerModule } from "../customer/customer.module";
import { MonriModule } from "../monri/monri.module";

@Module({
  imports: [
    JobsModule,
    OrganizationModule,
    PackageModule,
    SubscriptionPlanModule,
    UsersModule,
    SubscriptionModule,
    CustomerModule,
    MonriModule,
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
