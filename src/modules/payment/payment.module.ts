import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { JobsModule } from "../jobs/jobs.module";
import { OrganizationModule } from "../organization/organization.module";

@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
  imports: [JobsModule, OrganizationModule],
})
export class PaymentModule {}
