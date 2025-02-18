import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { OpenaiModule } from "./modules/openai/openai.module";
import { ConfigModule } from "@nestjs/config";
import { PdfModule } from "./modules/pdf/pdf.module";
import { ApplicantsModule } from "./modules/applicants/applicants.module";
import { ApplicantModule } from "./modules/applicant/applicant.module";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { SpacesModule } from "./modules/spaces/spaces.module";
import { S3_CLIENT_CONFIG } from "./modules/spaces/config/spaces.config";
import { SpacesService } from "./modules/spaces/spaces.service";

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
    ApplicantsModule,
    ApplicantModule,
  ],
  controllers: [AppController],
  providers: [SpacesService],
})
export class AppModule {}
