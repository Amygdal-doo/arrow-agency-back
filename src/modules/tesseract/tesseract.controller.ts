import { Controller } from "@nestjs/common";
import { TesseractService } from "./tesseract.service";

@Controller("tesseract")
export class TesseractController {
  constructor(private readonly tesseractService: TesseractService) {}
}
