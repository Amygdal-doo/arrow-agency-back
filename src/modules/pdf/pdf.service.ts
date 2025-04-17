import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PdfReader } from "pdfreader";
import {
  CHAT_INSTRUCTIONS_6_1,
  CHAT_INSTRUCTIONS_6_2,
  CHAT_INSTRUCTIONS_6_3,
  OpenaiService,
} from "../openai/openai.service";
import * as fs from "fs";
import * as path from "path";
import { ICvData, ICvDataExtended } from "./interfaces/cv-data.interface";
import { NotFoundException } from "src/common/exceptions/errors/common/not-found.exception.filter";
import * as handlebars from "handlebars";
import { PuppeteerService } from "../puppeteer/puppeteer.service";

import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import { createCanvas } from "canvas";

import puppeteer from "puppeteer";
import { TesseractService } from "../tesseract/tesseract.service";

@Injectable()
export class PdfService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly puppeteerService: PuppeteerService,
    private readonly tesseractService: TesseractService
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
  async savePdfFileToJson(file: Express.Multer.File) {
    // return { message: 'File uploaded successfully' };
    const pdfText = await this.getPdfText(file.buffer);
    this.logger.log("Pdf data extracted succesfully...");
    const jsonObject = await this.openaiService.createJsonObject(pdfText);
    this.logger.log("Ai created json succesfully...");
    console.log(jsonObject);
    let object: ICvData;
    try {
      object = JSON.parse(jsonObject) as ICvData;
    } catch (error) {
      // console.error("Failed to parse JSON object:", error);
      // throw new BadRequestException("Invalid JSON format");
      return null;
    }

    return object;
  }

  async savePdfFileToJsonDivided(file: Express.Multer.File): Promise<ICvData> {
    let first: string;
    let second: string;
    let third: string;
    // return { message: 'File uploaded successfully' };
    const pdfText = await this.getPdfText(file.buffer);
    if (pdfText.length < 30) {
      this.logger.log("Pdf text is too short...");
      return null;
    }
    this.logger.log("Pdf data/text extracted succesfully...");

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
    this.logger.log("Template loaded successfully...");

    // Format dates for better readability (optional)
    const formattedData = this.formatCvData(data);
    this.logger.log("Data formatted successfully...");

    // Render HTML with data
    const html = template({
      ...formattedData,
      companyName: data.companyName,
      logoUrl: data.companyLogoUrl,
    });
    this.logger.log("HTML rendered successfully...");

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
      })),
      projects: data.projects.map((proj) => ({
        ...proj,
      })),
      educations: data.educations.map((edu) => ({
        ...edu,
      })),
      certificates: data.certificates.map((cert) => ({
        ...cert,
      })),
      courses: data.courses.map((course) => ({
        ...course,
      })),
    };

    // return {
    //   ...data,
    //   experience: data.experience.map((exp) => ({
    //     ...exp,
    //     startDate: formatDate(exp.startDate),
    //     endDate: exp.endDate ? formatDate(exp.endDate) : undefined,
    //   })),
    //   projects: data.projects.map((proj) => ({
    //     ...proj,
    //     startDate: formatDate(proj.startDate),
    //     endDate: proj.endDate ? formatDate(proj.endDate) : undefined,
    //   })),
    //   educations: data.educations.map((edu) => ({
    //     ...edu,
    //     startDate: formatDate(edu.startDate),
    //     endDate: edu.endDate ? formatDate(edu.endDate) : undefined,
    //   })),
    //   certificates: data.certificates.map((cert) => ({
    //     ...cert,
    //     issueDate: formatDate(cert.issueDate),
    //     expirationDate: cert.expirationDate
    //       ? formatDate(cert.expirationDate)
    //       : undefined,
    //   })),
    //   courses: data.courses.map((course) => ({
    //     ...course,
    //     startDate: formatDate(course.startDate),
    //     endDate: course.endDate ? formatDate(course.endDate) : undefined,
    //   })),
    // };
  }

  // async convertPdfToImagesAndExtractText(
  //   file: Express.Multer.File
  // ): Promise<string> {
  //   const tempDir = path.join(process.cwd(), "temp");
  //   if (!fs.existsSync(tempDir)) {
  //     fs.mkdirSync(tempDir);
  //   }

  //   const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  //   const outputText: string[] = [];

  //   try {
  //     // Step 1: Split PDF into individual pages
  //     const pagePaths = await this.splitPdfPages(file.buffer, tempDir);

  //     const browser = await puppeteer.launch({
  //       headless: true,
  //       args: ["--no-sandbox", "--disable-setuid-sandbox"],
  //     });

  //     for (let i = 0; i < pagePaths.length; i++) {
  //       console.log(`Processing page ${i + 1} of ${pagePaths.length}`);

  //       const page = await browser.newPage();
  //       await page.goto(`file://${pagePaths[i]}`, {
  //         waitUntil: [
  //           "networkidle0",
  //           "domcontentloaded",
  //           "load",
  //           "networkidle2",
  //         ],
  //       });

  //       const imagePath = path.join(tempDir, `${uniqueId}-page-${i + 1}.png`);
  //       await page.setViewport({ width: 1240, height: 900 });
  //       await page.screenshot({
  //         path: imagePath,
  //         fullPage: true,
  //         fromSurface: false,
  //       });

  //       // const {
  //       //   data: { text },
  //       // } = await Tesseract.recognize(imagePath, "eng");
  //       // outputText.push(text);
  //       const text =
  //         await this.tesseractService.extractTextFromImagePath(imagePath);
  //       outputText.push(text);

  //       // Clean up individual image
  //       await fs.promises.unlink(imagePath);
  //       await fs.promises.unlink(pagePaths[i]);
  //     }

  //     await browser.close();
  //     return outputText.join("\n\n");
  //   } catch (error) {
  //     console.error("Error processing PDF:", error);
  //     throw new Error("Failed to process PDF");
  //   }
  // }

  async savePdfImageToJsonDivided(file: Express.Multer.File): Promise<ICvData> {
    let first: string;
    let second: string;
    let third: string;
    // return { message: 'File uploaded successfully' };
    console.time("Pdf to text");
    const pdfText = await this.convertPdfToImagesAndExtractText2(file);
    console.timeEnd("Pdf to text");

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
    // console.log(first);

    second = await this.openaiService.createJsonObjectInstructions(
      pdfText,
      CHAT_INSTRUCTIONS_6_2
    );
    this.logger.log("Ai created second json succesfully...");
    // console.log(second);

    third = await this.openaiService.createJsonObjectInstructions(
      pdfText,
      CHAT_INSTRUCTIONS_6_3
    );
    this.logger.log("Ai created third json succesfully...");
    // console.log(third);

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

  // latest 5

  async splitPdfPages(
    fileBuffer: Buffer,
    outputDir: string
  ): Promise<string[]> {
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const pageCount = pdfDoc.getPageCount();
    const pagePaths: string[] = [];

    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
      const pdfBytes = await newPdf.save();

      const tempPath = path.join(outputDir, `page-${i + 1}.pdf`);
      await fs.promises.writeFile(tempPath, pdfBytes);
      pagePaths.push(tempPath);
    }

    return pagePaths;
  }

  async convertPdfPageToImage(
    pdfPath: string,
    pageNum: number
  ): Promise<string> {
    const pdfData = new Uint8Array(await fs.promises.readFile(pdfPath));
    const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });

    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext("2d");

    await page.render({ canvasContext: ctx, viewport }).promise;

    const imagePath = pdfPath.replace(".pdf", ".png");
    await fs.promises.writeFile(imagePath, canvas.toBuffer("image/png"));
    return imagePath;
  }

  async convertPdfToImagesAndExtractText2(
    file: Express.Multer.File
  ): Promise<string> {
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const outputText: string[] = [];

    try {
      // Step 1: Split PDF into individual pages
      const pagePaths = await this.splitPdfPages(file.buffer, tempDir);

      // Step 2: Process each page
      for (let i = 0; i < pagePaths.length; i++) {
        console.log(`Processing page ${i + 1} of ${pagePaths.length}`);

        // Convert PDF page to image
        const imagePath = await this.convertPdfPageToImage(pagePaths[i], 1);

        // Extract text from image
        const text =
          await this.tesseractService.extractTextFromImagePath(imagePath);
        outputText.push(`--- Page ${i + 1} ---\n${text}`);

        // Clean up individual image and page
        await fs.promises.unlink(imagePath);
        await fs.promises.unlink(pagePaths[i]);
      }

      return outputText.join("\n\n");
    } catch (error) {
      console.error("Error processing PDF:", error);
      // throw new Error("Failed to process PDF");
      return "";
    } finally {
      // Clean up temp directory if empty
      // if (fs.existsSync(tempDir) && fs.readdirSync(tempDir).length === 0) {
      //   fs.rmdirSync(tempDir);
      // }
    }
  }
}
