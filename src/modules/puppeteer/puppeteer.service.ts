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

  // async initializeBrowser() {
  //   try {
  //     if (!this.browser) {
  //       this.browser = await puppeteer.launch({
  //         headless: true,
  //         args: ["--no-sandbox", "--disable-setuid-sandbox"],
  //         // userDataDir: "./user_data",
  //       });
  //       this.logger.log("Browser launched successfully.");

  //       this.browser.once("disconnected", async () => {
  //         this.logger.warn("Browser disconnected.");
  //         await this.browser.close();
  //         await this.initializeBrowser();
  //       });
  //     }
  //   } catch (error) {
  //     console.error(`Error launching browser: ${error}`);
  //     setTimeout(this.initializeBrowser, 1000);
  //   }
  // }

  // async closeBrowser() {
  //   if (this.browser) {
  //     await this.browser.close();
  //     this.browser = null;
  //     this.logger.log("Browser is closed...");
  //   }
  // }

  // async createPdfFile(html: string): Promise<Buffer> {
  //   let page;
  //   try {
  //     await this.initializeBrowser();
  //     page = await this.browser.newPage();
  //     await page.setContent(html);
  //     const pdf = await page.pdf({
  //       format: "A4",
  //       printBackground: true,
  //       margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
  //     });
  //     await page.close();
  //     return Buffer.from(pdf);
  //   } catch (error) {
  //     this.logger.error(`Error creating PDF: ${error}`);
  //     // await page.close();
  //     throw new InternalServerErrorException("Error creating PDF");
  //   }
  // }

  async initializeBrowser(): Promise<void> {
    let rep = 0;
    try {
      if (!this.browser) {
        this.logger.log("Launching browser...");
        this.browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          // userDataDir: './user_data', // Uncomment if needed
        });
        this.logger.log("Browser launched successfully.");

        this.browser.once("disconnected", async () => {
          this.logger.warn("Browser disconnected.");
          await this.closeBrowser();
          // Retry initialization after a delay
          setTimeout(() => this.initializeBrowser(), 1000);
        });
      }
    } catch (error) {
      this.logger.error(`Error launching browser: ${error}`);
      // Retry after a delay using an arrow function to preserve context
      rep++;
      if (rep > 5) {
        rep = 0;
        this.logger.error("Error launching browser: Max retries exceeded");
        return;
      }
      setTimeout(() => this.initializeBrowser(), 1000);
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      try {
        await this.browser.close();
        this.logger.log("Browser closed successfully.");
      } catch (error) {
        this.logger.error(`Error closing browser: ${error}`);
      } finally {
        this.browser = null;
      }
    }
  }

  async createPdfFile(html: string): Promise<Buffer> {
    let page;
    try {
      // Ensure browser is initialized
      if (!this.browser) {
        await this.initializeBrowser();
      }
      if (!this.browser) {
        throw new Error("Browser initialization failed");
      }

      page = await this.browser.newPage();
      await page.setContent(html, { waitUntil: "domcontentloaded" });
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
      });
      return Buffer.from(pdf);
    } catch (error) {
      this.logger.error(`Error creating PDF: ${error}`);
      throw new InternalServerErrorException("Error creating PDF");
    } finally {
      // Ensure page is closed to prevent resource leaks
      if (page) {
        try {
          await page.close();
        } catch (error) {
          this.logger.error(`Error closing page: ${error}`);
        }
      }
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
