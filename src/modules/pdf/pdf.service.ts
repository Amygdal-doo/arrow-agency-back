import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PdfReader } from "pdfreader";
import { OpenaiService } from "../openai/openai.service";
import * as fs from "fs";
import * as path from "path";
import { ICvData, ICvDataExtended } from "./interfaces/cv-data.interface";
import { NotFoundException } from "src/common/exceptions/errors/common/not-found.exception.filter";
import * as handlebars from "handlebars";
import { PuppeteerService } from "../puppeteer/puppeteer.service";

@Injectable()
export class PdfService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly puppeteerService: PuppeteerService
  ) {}
  private logger = new Logger(PdfService.name);

  handlePdfFileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("no file uploaded");
    }

    // validate file type
    const allowedMimeTypes = ["application/pdf"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException("invalid file type");
    }

    // validate file size (e.g., max 5mb)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException("file is too large!");
    }

    return { message: "File uploaded successfully", filePath: file.path };
  }

  async getPdfText(fileBuffer: Buffer): Promise<string> {
    const pdfReader = new PdfReader();
    let text = "";

    // Return a Promise that resolves when parsing is complete
    return new Promise((resolve, reject) => {
      pdfReader.parseBuffer(fileBuffer, (err, item) => {
        if (err) {
          console.error("Error reading PDF:", err);
          reject(err); // Reject promise on error
        } else if (!item) {
          // End of file
          resolve(text); // Resolve promise with accumulated text
        } else if (item.text) {
          // Append text from this item
          text += `${item.text} `;
        }
      });
    });
  }
  async savePdfToJson(file: Express.Multer.File) {
    // return { message: 'File uploaded successfully' };
    const pdfText = await this.getPdfText(file.buffer);
    const jsonObject = await this.openaiService.createJsonObject(pdfText);
    this.logger.log("Ai created json succesfully");
    let object: ICvData;
    try {
      object = JSON.parse(jsonObject) as ICvData;
    } catch (error) {
      console.error("Failed to parse JSON object:", error);
      throw new BadRequestException("Invalid JSON format");
    }

    return object;
  }

  async generateCvPdfPuppeteer(
    data: ICvDataExtended,
    templateId: string
  ): Promise<Buffer> {
    const templatePath = path.join(
      process.cwd(),
      "public",
      "templates",
      `${templateId}.html`
    );

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException(`Template "${templateId}" not found`);
    }

    // Read and compile the template
    const templateHtml = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(templateHtml);

    // Format dates for better readability (optional)
    const formattedData = this.formatCvData(data);

    // Render HTML with data
    const html = template({
      ...formattedData,
      companyName: data.companyName,
      logoUrl: data.companyLogoUrl,
    });

    const pdf = await this.puppeteerService.createPdfFile(html);

    return pdf;
  }

  private formatCvData(data: ICvData): ICvData {
    const formatDate = (dateStr: string): string => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    };

    return {
      ...data,
      experience: data.experience.map((exp) => ({
        ...exp,
        startDate: formatDate(exp.startDate),
        endDate: exp.endDate ? formatDate(exp.endDate) : undefined,
      })),
      projects: data.projects.map((proj) => ({
        ...proj,
        startDate: formatDate(proj.startDate),
        endDate: proj.endDate ? formatDate(proj.endDate) : undefined,
      })),
      educations: data.educations.map((edu) => ({
        ...edu,
        startDate: formatDate(edu.startDate),
        endDate: edu.endDate ? formatDate(edu.endDate) : undefined,
      })),
      certificates: data.certificates.map((cert) => ({
        ...cert,
        issueDate: formatDate(cert.issueDate),
        expirationDate: cert.expirationDate
          ? formatDate(cert.expirationDate)
          : undefined,
      })),
      courses: data.courses.map((course) => ({
        ...course,
        startDate: formatDate(course.startDate),
        endDate: course.endDate ? formatDate(course.endDate) : undefined,
      })),
    };
  }
}
