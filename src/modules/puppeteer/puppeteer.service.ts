import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import puppeteer, { Browser } from "puppeteer";

@Injectable()
export class PuppeteerService {
  private browser: Browser = null;
  logger: Logger = new Logger(PuppeteerService.name);

  async initializeBrowser() {
    try {
      if (!this.browser) {
        this.browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          // userDataDir: "./user_data",
        });
        this.logger.log("Browser launched successfully.");

        this.browser.once("disconnected", async () => {
          this.logger.warn("Browser disconnected.");
          await this.browser.close();
          await this.initializeBrowser();
        });
      }
    } catch (error) {
      console.error(`Error launching browser: ${error}`);
      setTimeout(this.initializeBrowser, 1000);
    }
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.logger.log("Browser is closed...");
    }
  }

  async createPdfFile(html: string): Promise<Buffer> {
    let page;
    try {
      await this.initializeBrowser();
      page = await this.browser.newPage();
      await page.setContent(html);
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
      });
      await page.close();
      return Buffer.from(pdf);
    } catch (error) {
      this.logger.error(`Error creating PDF: ${error}`);
      // await page.close();
      throw new InternalServerErrorException("Error creating PDF");
    }
  }

  async convertPdfToImage(pdfBuffer: Buffer): Promise<Buffer> {
    await this.initializeBrowser();
    let page;
    try {
      page = await this.browser.newPage();

      // Load PDF from buffer
      const pdfDataUrl = `data:application/pdf;base64,${pdfBuffer.toString("base64")}`;
      await page.goto(pdfDataUrl);

      // Take screenshot of the first page
      const imageBuffer = await page.screenshot({
        type: "png",
        fullPage: true,
      });

      return imageBuffer as Buffer;
    } finally {
      await this.browser.close();
    }
  }
}
