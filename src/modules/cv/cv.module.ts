import { Module } from "@nestjs/common";
import { CvService } from "./services/cv.service";
import { CvController } from "./controllers/cv.controller";
import { PdfModule } from "../pdf/pdf.module";

@Module({
  imports: [PdfModule],
  providers: [CvService],
  controllers: [CvController],
})
export class CvModule {}
