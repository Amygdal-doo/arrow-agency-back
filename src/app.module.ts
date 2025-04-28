import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { OpenaiModule } from "./modules/openai/openai.module";
import { ConfigModule } from "@nestjs/config";
import { PdfModule } from "./modules/pdf/pdf.module";
import { ApplicantModule } from "./modules/applicant/applicant.module";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { SpacesModule } from "./modules/spaces/spaces.module";
import { S3_CLIENT_CONFIG } from "./modules/spaces/config/spaces.config";
import { SpacesService } from "./modules/spaces/spaces.service";
import { FileModule } from "./modules/file/file.module";
import { CvModule } from "./modules/cv/cv.module";
import { PuppeteerModule } from "./modules/puppeteer/puppeteer.module";
import { HttpLoggerMiddleware } from "./middleware/logging/logging.middleware";
import { OrganizationModule } from "./modules/organization/organization.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { SkillModule } from "./modules/skill/skill.module";
import { MonriModule } from "./modules/monri/monri.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { TesseractModule } from "./modules/tesseract/tesseract.module";
import { SubscriptionPlanModule } from "./modules/subscription-plan/subscription-plan.module";
import { PackageModule } from "./modules/package/package.module";
import { rateLimitoptions } from "./common/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { SendgridModule } from "./modules/sendgrid/sendgrid.module";
import { SubscriptionModule } from "./modules/subscription/subscription.module";
import { CustomerModule } from "./modules/customer/customer.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([rateLimitoptions]),
    AuthModule,
    UsersModule,
    DatabaseModule,
    SpacesModule.forRoot(S3_CLIENT_CONFIG),
    OpenaiModule,
    PdfModule,
    ApplicantModule,
    FileModule,
    CvModule,
    PuppeteerModule,
    OrganizationModule,
    JobsModule,
    SkillModule,
    PaymentModule,
    MonriModule,
    TesseractModule,
    SubscriptionPlanModule,
    PackageModule,
    SendgridModule,
    SubscriptionModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [
    SpacesService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes("*");
  }
}
