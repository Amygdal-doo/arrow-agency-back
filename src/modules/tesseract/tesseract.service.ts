import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { createWorker } from "tesseract.js";
import { OpenaiService } from "../openai/openai.service";
import { ICvData } from "../pdf/interfaces/cv-data.interface";

@Injectable()
export class TesseractService {
  private logger = new Logger(TesseractService.name);
  constructor(private readonly openaiService: OpenaiService) {}

  async extractTextFromImageBuffer(file: Express.Multer.File): Promise<string> {
    try {
      if (!file) {
        throw new Error("No file provided");
      }
      // Create Tesseract worker
      const worker = await createWorker("eng", 1, {
        // logger: (m) => console.log(m),
      });
      // Load and initialize
      await worker.load();

      // Use file.buffer directly instead of file path
      const {
        data: { text },
      } = await worker.recognize(file.buffer);
      // Clean up
      await worker.terminate();

      return text;
    } catch (error) {
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  async extractTextFromImagePath(imagePath: string): Promise<string> {
    try {
      if (!imagePath) {
        throw new Error("Image path is required");
      }

      const worker = await createWorker();

      await worker.load();
      //   await worker.loadLanguage('eng');
      //   await worker.initialize('eng');

      const { data } = await worker.recognize(imagePath);

      if (!data.text) {
        throw new Error("No text detected in image");
      }

      await worker.terminate();
      return data.text;
    } catch (error) {
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  async savePdfImageToJson(file: Express.Multer.File) {
    // return { message: 'File uploaded successfully' };
    const pdfText = await this.extractTextFromImageBuffer(file);
    const jsonObject = await this.openaiService.createJsonObject(pdfText);
    this.logger.log("Ai created json succesfully");
    console.log(jsonObject);
    let object: ICvData;
    try {
      object = JSON.parse(jsonObject) as ICvData;
    } catch (error) {
      console.error("Failed to parse JSON object:", error);
      throw new BadRequestException("Invalid JSON format");
    }

    return object;
  }
}
