import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import * as puppeteer from "puppeteer";

@Injectable()
export class PuppeteerService {
  private browser: puppeteer.Browser = null;
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
    try {
      await this.initializeBrowser();
      const page = await this.browser.newPage();
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
      throw new InternalServerErrorException("Error creating PDF");
    }
  }
}
