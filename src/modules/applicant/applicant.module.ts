import { Module } from "@nestjs/common";
import { ApplicantService } from "./applicant.service";
import { ApplicantController } from "./applicant.controller";
import { PdfModule } from "../pdf/pdf.module";

@Module({
  providers: [ApplicantService],
  controllers: [ApplicantController],
  exports: [ApplicantService],
  imports: [PdfModule],
})
export class ApplicantModule {}
