import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from './modules/openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { PdfModule } from './modules/pdf/pdf.module';
import { ApplicantsModule } from './modules/applicants/applicants.module';
import { ApplicantModule } from './modules/applicant/applicant.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
    }),
    DatabaseModule,
    OpenaiModule,
    PdfModule,
    ApplicantsModule,
    ApplicantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
