import { Module } from "@nestjs/common";
import { TesseractController } from "./tesseract.controller";
import { TesseractService } from "./tesseract.service";
import { OpenaiModule } from "../openai/openai.module";

@Module({
  controllers: [TesseractController, OpenaiModule],
  providers: [TesseractService],
  exports: [TesseractService],
})
export class TesseractModule {}
