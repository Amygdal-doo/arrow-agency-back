import { Module } from "@nestjs/common";
import { TesseractController } from "./tesseract.controller";
import { TesseractService } from "./tesseract.service";
import { OpenaiModule } from "../openai/openai.module";

@Module({
  imports: [OpenaiModule],
  controllers: [TesseractController],
  providers: [TesseractService],
  exports: [TesseractService],
})
export class TesseractModule {}
