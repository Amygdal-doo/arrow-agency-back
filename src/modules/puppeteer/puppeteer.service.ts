import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import puppeteer, { Browser } from "puppeteer-core";

@Injectable()
export class PuppeteerService {
  constructor(private readonly configService: ConfigService) {}

  private browser: Browser | null = null;
  private logger: Logger = new Logger(PuppeteerService.name);
  private initializationPromise: Promise<void> | null = null;
  private lastInitializationFailure: number = 0;
  private initializationCooldown: number = 60000; // 1 minute in milliseconds

  /**
   * Initializes the browser, ensuring only one initialization attempt runs at a time.
   * Respects a cooldown period after repeated failures.
   */
  async initializeBrowser(): Promise<void> {
    if (this.browser) {
      return; // Browser is already initialized
    }

    const now = Date.now();
    if (
      this.lastInitializationFailure &&
      now - this.lastInitializationFailure < this.initializationCooldown
    ) {
      throw new Error("Initialization failed recently, please try again later");
    }

    // If an initialization is already in progress, wait for it
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // Start a new initialization attempt
    this.initializationPromise = this.doInitializeBrowser();
    try {
      await this.initializationPromise;
    } catch (error) {
      this.lastInitializationFailure = Date.now(); // Set cooldown on failure
      throw error;
    } finally {
      this.initializationPromise = null; // Reset promise after completion
    }
  }

  /**
   * Performs the actual browser initialization with retry logic.
   * @private
   */
  private async doInitializeBrowser(): Promise<void> {
    const maxRetries = 5;
    let rep = 0;

    while (rep < maxRetries) {
      try {
        this.logger.log("Launching browser...");
        // this.browser = await puppeteer.launch({
        //   headless: true,
        //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
        //   // userDataDir: './user_data', // Uncomment if needed
        // });
        this.browser = await puppeteer.connect({
          browserWSEndpoint: this.configService.get<string>(
            "BROWSER_WS_ENDPOINT"
          ),
        });
        this.logger.log("Browser launched successfully.");

        // Handle browser disconnection
        this.browser.once("disconnected", async () => {
          this.logger.warn("Browser disconnected.");
          await this.closeBrowser();
          // Retry initialization after a delay
          setTimeout(() => {
            this.initializeBrowser().catch((error) => {
              this.logger.error(`Failed to reinitialize browser: ${error}`);
            });
          }, 5000); // 5-second delay before retrying
        });
        return; // Success, exit the method
      } catch (error) {
        this.logger.error(`Error launching browser: ${error}`);
        rep++;
        if (rep >= maxRetries) {
          throw new Error("Max retries exceeded"); // All retries failed
        }
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
      }
    }
  }

  /**
   * Closes the browser and cleans up resources.
   */
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
