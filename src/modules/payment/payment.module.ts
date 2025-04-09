import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { JobsModule } from "../jobs/jobs.module";
import { OrganizationModule } from "../organization/organization.module";
import { PackageModule } from "../package/package.module";
import { SubscriptionPlanModule } from "../subscription-plan/subscription-plan.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    JobsModule,
    OrganizationModule,
    PackageModule,
    SubscriptionPlanModule,
    UsersModule,
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
