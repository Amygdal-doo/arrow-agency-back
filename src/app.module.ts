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
import { PaymentModule } from "./modules/payment/payment.module";
import { TesseractModule } from './modules/tesseract/tesseract.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
    }),
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
    TesseractModule,
  ],
  controllers: [AppController],
  providers: [SpacesService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes("*");
  }
}
