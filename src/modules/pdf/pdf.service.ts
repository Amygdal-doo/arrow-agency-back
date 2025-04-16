import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PdfReader } from "pdfreader";
import {
  CHAT_INSTRUCTIONS_6_1,
  CHAT_INSTRUCTIONS_6_2,
  CHAT_INSTRUCTIONS_6_3,
  OpenaiService,
} from "../openai/openai.service";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { ICvData, ICvDataExtended } from "./interfaces/cv-data.interface";
import { NotFoundException } from "src/common/exceptions/errors/common/not-found.exception.filter";
import * as handlebars from "handlebars";
import { PuppeteerService } from "../puppeteer/puppeteer.service";

// import * as Tesseract from "tesseract.js";
import Tesseract, { createWorker } from "tesseract.js";
import { promises as fsPromise } from "fs";
import puppeteer from "puppeteer";
// import { pdfToPng } from 'pdf-to-png-converter';

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

  // async extractTextFromPdf(filePath: string): Promise<string> {
  //   const outputDir = path.join("/tmp", `pdf2pic-${Date.now()}`);
  //   await fsPromise.mkdir(outputDir, { recursive: true });

  //   const converter = fromPath(filePath, {
  //     density: 150,
  //     saveFilename: "page",
  //     savePath: outputDir,
  //     format: "png",
  //     width: 1024,
  //     height: 1024,
  //   });

  //   try {
  //     // Convert all pages
  //     const result = await converter.bulk(-1); // -1 = all pages

  //     let fullText = "";
  //     for (const page of result) {
  //       const ocrResult = await Tesseract.recognize(page.path, "eng");
  //       fullText += ocrResult.data.text + "\n";
  //     }

  //     return fullText;
  //   } finally {
  //     await fsPromise.unlink(filePath).catch(() => {});
  //     await fsPromise
  //       .rm(outputDir, { recursive: true, force: true })
  //       .catch(() => {});
  //   }
  // }

  // async extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
  //   let pdfPath: string | undefined;
  //   try {
  //     // Save PDF buffer to a temporary file
  //     pdfPath = await this.saveToTempFile(pdfBuffer, "pdf");

  //     // Convert PDF to array of image buffers using pdf-to-img
  //     const imageBuffers = await pdfToImg.convert(pdfPath);

  //     // Initialize Tesseract worker
  //     const worker = createWorker();
  //     await worker.load();
  //     await worker.loadLanguage("eng");
  //     await worker.initialize("eng");

  //     // Extract text from each image buffer
  //     const texts: string[] = [];
  //     for (const imageBuffer of imageBuffers) {
  //       const {
  //         data: { text },
  //       } = await worker.recognize(imageBuffer);
  //       texts.push(text);
  //     }

  //     // Terminate the worker
  //     await worker.terminate();

  //     // Return concatenated text
  //     return texts.join("\n");
  //   } finally {
  //     // Clean up temporary PDF file
  //     if (pdfPath) {
  //       await this.deleteTempFile(pdfPath);
  //     }
  //   }
  // }

  // private async saveToTempFile(buffer: Buffer, ext: string): Promise<string> {
  //   const tempDir = os.tmpdir();
  //   const fileName = `temp-${Date.now()}.${ext}`;
  //   const filePath = path.join(tempDir, fileName);
  //   await fsPromise.writeFile(filePath, buffer);
  //   return filePath;
  // }

  // private async deleteTempFile(filePath: string): Promise<void> {
  //   await fsPromise.unlink(filePath);
  // }

  // async convertPdfToImageAndExtractText2(
  //   file: Express.Multer.File
  // ): Promise<string> {
  //   // Generate unique temporary file paths for the PDF and image
  //   const tempPdfPath = path.join(os.tmpdir(), `${Date.now()}.pdf`);
  //   const tempImagePath = path.join(os.tmpdir(), `${Date.now()}.png`);

  //   try {
  //     // Write the file buffer to a temporary PDF file
  //     fs.writeFile(tempPdfPath, file.buffer, (err) => {});

  //     // Launch Puppeteer with options for compatibility (e.g., on platforms like Railway)
  //     const browser = await puppeteer.launch({
  //       args: ["--no-sandbox", "--disable-setuid-sandbox"],
  //       headless: true,
  //     });
  //     const page = await browser.newPage();

  //     // Load the temporary PDF file into Puppeteer
  //     await page.goto(`file://${tempPdfPath}`, { waitUntil: "networkidle0" });

  //     // Capture a screenshot of the PDF (first page) as an image
  //     await page.screenshot({ path: "./temp.png", fullPage: true });

  //     // Close the Puppeteer browser
  //     await browser.close();

  //     // Perform OCR on the generated image to extract text
  //     const {
  //       data: { text },
  //     } = await Tesseract.recognize(tempImagePath, "eng");

  //     // Delete the temporary files
  //     fs.unlink(tempPdfPath, () => {});
  //     fs.unlink(tempImagePath, () => {});

  //     // Return the extracted text
  //     return text;
  //   } catch (error) {
  //     console.error("Error processing PDF:", error);
  //     throw new Error("Failed to convert PDF or extract text");
  //   }
  // }

  // latest 1
  // async convertPdfToImageAndExtractText2(
  //   file: Express.Multer.File
  // ): Promise<string> {
  //   const tempPdfPath = path.join(os.tmpdir(), `${Date.now()}.pdf`);
  //   const tempImagePath = path.join(os.tmpdir(), `${Date.now()}.png`);

  //   try {
  //     // Write the PDF file synchronously or await it
  //     await fs.promises.writeFile(tempPdfPath, file.buffer);

  //     // Launch Puppeteer
  //     const browser = await puppeteer.launch({
  //       args: ["--no-sandbox", "--disable-setuid-sandbox"],
  //       headless: true,
  //     });
  //     const page = await browser.newPage();
  //     await page.goto(`file://${tempPdfPath}`, { waitUntil: "networkidle0" });

  //     // Capture screenshot using the correct
  //     await page.setViewport({ width: 1920, height: 1080 });
  //     await page.screenshot({ path: tempImagePath, fullPage: true });
  //     await browser.close();
  //     console.log(tempImagePath);

  //     // Perform OCR
  //     const {
  //       data: { text },
  //     } = await Tesseract.recognize(tempImagePath, "eng");

  //     // Clean up temporary files (optional: handle errors)
  //     await fs.promises.unlink(tempPdfPath);
  //     await fs.promises.unlink(tempImagePath);

  //     return text;
  //   } catch (error) {
  //     console.error("Error processing PDF:", error);
  //     throw new Error("Failed to convert PDF or extract text");
  //   }
  // }

  //latest 2
  async convertPdfToImageAndExtractText2(
    file: Express.Multer.File
  ): Promise<string> {
    const tempDir = path.join(process.cwd(), "temp");

    // Ensure the temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const tempPdfPath = path.join(tempDir, `${uniqueSuffix}.pdf`);
    const tempImagePath = path.join(tempDir, `${uniqueSuffix}.png`);

    try {
      // Save the PDF to the local temp folder
      await fs.promises.writeFile(tempPdfPath, file.buffer);

      // Launch Puppeteer
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
      });
      const page = await browser.newPage();
      await page.goto(`file://${tempPdfPath}`, {
        waitUntil: ["networkidle0", "domcontentloaded", "load", "networkidle2"],
      });

      // Screenshot
      await page.setViewport({
        width: 1240,
        height: 800,
      });
      await page.screenshot({
        path: tempImagePath,
        fullPage: true, // ussually uncmoneted
        fromSurface: false, // ussually false
        // clip: { x: 400, y: 0, width: 500, height: 900 },
      });
      await browser.close();

      // OCR
      const {
        data: { text },
      } = await Tesseract.recognize(tempImagePath, "eng");

      // Clean up
      await fs.promises.unlink(tempPdfPath);
      await fs.promises.unlink(tempImagePath);

      return text;
    } catch (error) {
      console.error("Error processing PDF:", error);
      throw new Error("Failed to convert PDF or extract text");
    }
  }

  // latest 3
  async convertPdfToScreenshot(
    pdfBuffer: Buffer,
    outputPath: string
  ): Promise<void> {
    const tempPdfPath = path.join(
      process.cwd(),
      "temp",
      `pdf-${Date.now()}.pdf`
    );

    // Ensure temp folder exists
    fs.mkdirSync(path.dirname(tempPdfPath), { recursive: true });

    // Write the buffer to a file
    fs.writeFileSync(tempPdfPath, pdfBuffer);

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });

    const page = await browser.newPage();

    // Set a large viewport to reduce need for too much scrolling
    await page.setViewport({ width: 1280, height: 1024 });

    // Open the local PDF file
    await page.goto(`file://${tempPdfPath}`, {
      waitUntil: "networkidle0",
      timeout: 500,
    });

    // Give it a bit of time to render if needed
    // await page.waitForTimeout(500);

    // Scroll through to load all PDF pages
    const fullHeight = await page.evaluate(async () => {
      const totalHeight = document.body.scrollHeight;
      window.scrollTo(0, totalHeight);
      return totalHeight;
    });

    // Set viewport to full height for a single-page screenshot
    await page.setViewport({ width: 1280, height: fullHeight });

    // Capture the full screenshot
    await page.screenshot({ path: outputPath, fullPage: true });

    await browser.close();

    // Clean up
    fs.unlinkSync(tempPdfPath);
  }
}
