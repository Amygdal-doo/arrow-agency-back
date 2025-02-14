import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { OpenaiModule } from '../openai/openai.module';
import { ApplicantModule } from '../applicant/applicant.module';

@Module({
  imports: [OpenaiModule, ApplicantModule],
  providers: [PdfService],
  controllers: [PdfController],
})
export class PdfModule {}
