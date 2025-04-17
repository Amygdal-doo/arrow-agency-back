import { Module } from "@nestjs/common";
import { PdfService } from "./pdf.service";
import { PdfController } from "./pdf.controller";
import { OpenaiModule } from "../openai/openai.module";
import { PuppeteerModule } from "../puppeteer/puppeteer.module";
import { TesseractModule } from "../tesseract/tesseract.module";

@Module({
  imports: [OpenaiModule, PuppeteerModule, TesseractModule],
  providers: [PdfService],
  controllers: [PdfController],
  exports: [PdfService],
})
export class PdfModule {}
