import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { createWorker } from "tesseract.js";
import {
  CHAT_INSTRUCTIONS_6_1,
  CHAT_INSTRUCTIONS_6_2,
  CHAT_INSTRUCTIONS_6_3,
  OpenaiService,
} from "../openai/openai.service";
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

  async savePdfImageToJsonDivided(file: Express.Multer.File): Promise<ICvData> {
    let first: string;
    let second: string;
    let third: string;
    // return { message: 'File uploaded successfully' };
    const pdfText = await this.extractTextFromImageBuffer(file);
    if (pdfText.length < 30) {
      this.logger.log("Pdf text is too short...");
      return null;
    }
    this.logger.log("Pdf data extracted succesfully...");

    first = await this.openaiService.createJsonObjectInstructions(
      pdfText,
      CHAT_INSTRUCTIONS_6_1
    );
    this.logger.log("Ai created first json succesfully...");
    console.log(first);

    second = await this.openaiService.createJsonObjectInstructions(
      pdfText,
      CHAT_INSTRUCTIONS_6_2
    );
    this.logger.log("Ai created second json succesfully...");
    console.log(second);

    third = await this.openaiService.createJsonObjectInstructions(
      pdfText,
      CHAT_INSTRUCTIONS_6_3
    );
    this.logger.log("Ai created third json succesfully...");
    console.log(third);

    let object1: ICvData;
    let object2: ICvData;
    let object3: ICvData;
    try {
      object1 = JSON.parse(first) as ICvData;
      object2 = JSON.parse(second) as ICvData;
      object3 = JSON.parse(third) as ICvData;
    } catch (error) {
      // console.error("Failed to parse JSON object:", error);
      // throw new BadRequestException("Invalid JSON format");
      return null;
    }

    return {
      firstName: object1.firstName,
      lastName: object1.lastName,
      companyName: object1.companyName,
      companyLogoUrl: object1.companyLogoUrl,
      email: object1.email,
      phone: object1.phone,
      summary: object1.summary,
      educations: object1.educations,
      hobies: object1.hobies,
      languages: object1.languages,
      socials: object1.socials,
      courses: object1.courses,

      certificates: object2.certificates,
      skills: object2.skills,
      projects: object2.projects,

      experience: object3.experience,
    };
  }
}
