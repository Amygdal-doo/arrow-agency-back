import { BadRequestException, Injectable } from "@nestjs/common";
import { PdfReader } from "pdfreader";
import { OpenaiService } from "../openai/openai.service";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import { ApplicantService } from "../applicant/applicant.service";
import { ICvData } from "./interfaces/cv-data.interface";
import { NotFoundException } from "src/common/exceptions/errors/common/not-found.exception.filter";
import * as puppeteer from "puppeteer";
import * as handlebars from "handlebars";
import { promises } from "fs";

@Injectable()
export class PdfService {
  constructor(private readonly openaiService: OpenaiService) {}
  private readonly companyName = "Amygdal, Inc.";

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
    console.log({ jsonObject });

    let object: ICvData;
    try {
      object = JSON.parse(jsonObject) as ICvData;
    } catch (error) {
      console.error("Failed to parse JSON object:", error);
      throw new BadRequestException("Invalid JSON format");
    }
    console.log(object);

    return object;
  }

  async generateCV(): Promise<Buffer> {
    const doc = new jsPDF();

    // --- Add Logo ---
    // Try to load the logo from a local file first
    const logoPath = path.join(
      __dirname,
      "../../../public/agency-logo-dark.png"
    );
    let logoData: string | null = null;

    if (fs.existsSync(logoPath)) {
      logoData = fs.readFileSync(logoPath).toString("base64");
    } else {
      // Fallback: load logo from a remote URL
      try {
        const response = await axios.get(
          "https://media.licdn.com/dms/image/v2/D4D0BAQEEKDKGlsG4QQ/company-logo_200_200/company-logo_200_200/0/1709460920387/amygdal_logo?e=1747267200&v=beta&t=OWiJNTQkaMafxIDUGIYmJql7CT8sm8bZpOuy_qF9S8k",
          { responseType: "arraybuffer" }
        );
        logoData = Buffer.from(response.data).toString("base64");
      } catch (error) {
        console.error("Failed to load fallback logo:", error);
      }
    }

    // If the logo data was successfully loaded, add it to the PDF.
    if (logoData) {
      // Parameters: (imageData, format, x, y, width, height)
      doc.addImage(logoData, "PNG", 10, 10, 30, 30);
    }

    // --- Set initial vertical offset ---
    let yOffset = 45;

    // --- Personal Information ---
    // Name and title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("John Doe", 50, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Senior Software Developer", 50, 27);

    // Contact information
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("📧 john.doe@example.com", 10, 40);
    doc.text("📱 +1 234 567 890", 10, 45);
    doc.text("📍 New York, USA", 10, 50);

    // --- Professional Summary Section ---
    this.addSection(doc, "Professional Summary", yOffset);
    yOffset += 10;
    doc.setFontSize(10);
    doc.text(
      "Experienced software developer with 8+ years in full-stack development.",
      10,
      yOffset,
      { maxWidth: 190 }
    );
    yOffset += 15;

    // --- Work Experience Section ---
    this.addSection(doc, "Work Experience", yOffset);
    yOffset += 10;
    this.addExperience(
      doc,
      "Senior Developer - Tech Corp",
      "2019-Present",
      yOffset
    );
    yOffset += 15;
    this.addExperience(
      doc,
      "Software Engineer - Dev Solutions",
      "2016-2019",
      yOffset
    );
    yOffset += 20;

    // --- Education Section ---
    this.addSection(doc, "Education", yOffset);
    yOffset += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Bachelor of Science in Computer Science", 10, yOffset);
    doc.text("University of Technology, 2012-2016", 10, yOffset + 5);

    // Convert the document to an array buffer and then to a Node Buffer
    const pdfOutput = doc.output("arraybuffer");
    return Buffer.from(pdfOutput);
  }

  private addSection(doc: jsPDF, title: string, yOffset: number) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title, 10, yOffset);
    doc.setFont("helvetica", "normal");
    doc.setDrawColor(200);
    doc.line(10, yOffset + 2, 200, yOffset + 2);
  }

  private addExperience(
    doc: jsPDF,
    position: string,
    duration: string,
    yOffset: number
  ) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(position, 10, yOffset);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(duration, 160, yOffset);
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(
      "- Developed and maintained enterprise applications",
      10,
      yOffset + 5,
      { maxWidth: 190 }
    );
    doc.text("- Led team of 5 developers", 10, yOffset + 10, { maxWidth: 190 });
  }

  async generateCvPdf(data: ICvData): Promise<Buffer> {
    const doc = new jsPDF();
    const margin = 15;
    let yPosition = margin;

    // --- Load Logo ---
    const logoPath = path.join(
      __dirname,
      "../../../public/agency-logo-dark.png"
    );
    let logoData: string | null = null;

    if (fs.existsSync(logoPath)) {
      logoData = fs.readFileSync(logoPath).toString("base64");
    } else {
      try {
        const response = await axios.get(
          "https://media.licdn.com/dms/image/v2/D4D0BAQEEKDKGlsG4QQ/company-logo_200_200/company-logo_200_200/0/1709460920387/amygdal_logo?e=1747267200&v=beta&t=OWiJNTQkaMafxIDUGIYmJql7CT8sm8bZpOuy_qF9S8k",
          { responseType: "arraybuffer" }
        );
        logoData = Buffer.from(response.data).toString("base64");
      } catch (error) {
        console.error("Failed to load fallback logo:", error);
      }
    }

    // --- Header Section ---
    if (logoData) {
      doc.addImage(logoData, "PNG", margin, margin, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(this.companyName, margin + 40, margin + 15); // Company name next to logo
      yPosition = margin + 40;
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(this.companyName, margin, margin + 10); // Company name alone
      yPosition = margin + 20;
    }
    // const fullName = data.firstName + ' ' + data.lastName;
    // // Add Name
    // doc.setFontSize(20);
    // doc.text(fullName, margin, yPosition);
    // yPosition += 10;

    // Contact Information
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    // doc.text(`Email: ${data.email}`, margin, yPosition);
    // doc.text(`Phone: ${data.phone}`, margin + 100, yPosition, {
    //   align: 'left',
    // });
    yPosition += 15;

    // --- Professional Summary ---
    doc.setFont("helvetica", "bold");
    doc.text("Professional Summary", margin, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "normal");

    // Fix overlapping by adjusting yPosition based on text height
    const summaryText = doc.splitTextToSize(
      data.summary,
      doc.internal.pageSize.getWidth() - margin * 2
    );
    doc.text(summaryText, margin, yPosition);
    yPosition += summaryText.length * 6 + 10;

    // --- Experience Section ---
    doc.setFont("helvetica", "bold");
    doc.text("Experience", margin, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "normal");

    data.experience.forEach((exp) => {
      doc.text(`${exp.position} at ${exp.company}`, margin, yPosition);
      yPosition += 8;
      doc.text(
        `${exp.startDate} - ${exp.endDate ? exp.endDate : "Present"}`,
        margin,
        yPosition
      );
      yPosition += 8;

      const expText = doc.splitTextToSize(
        exp.description,
        doc.internal.pageSize.getWidth() - margin * 2
      );
      doc.text(expText, margin, yPosition);
      yPosition += expText.length * 6 + 10; // Adjust for multiline text
    });

    // --- Skills Section ---
    doc.setFont("helvetica", "bold");
    doc.text("Skills", margin, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "normal");
    data.skills.forEach((skill, index) => {
      doc.text(`• ${skill}`, margin, yPosition + index * 6);
    });
    yPosition += data.skills.length * 6 + 10;

    // --- Convert to Buffer ---
    const pdfOutput = doc.output("arraybuffer");
    console.log({ pdfOutput });

    return Buffer.from(pdfOutput);
  }

  async generateCvPdfAny(data: any): Promise<Buffer> {
    const doc = new jsPDF();
    const margin = 15;
    let yPosition = margin;

    // --- Load Logo ---
    const logoPath = path.join(
      __dirname,
      "../../../public/agency-logo-dark.png"
    );
    let logoData: string | null = null;

    if (fs.existsSync(logoPath)) {
      logoData = fs.readFileSync(logoPath).toString("base64");
    } else {
      try {
        const response = await axios.get(
          "https://media.licdn.com/dms/image/v2/D4D0BAQEEKDKGlsG4QQ/company-logo_200_200/company-logo_200_200/0/1709460920387/amygdal_logo?e=1747267200&v=beta&t=OWiJNTQkaMafxIDUGIYmJql7CT8sm8bZpOuy_qF9S8k",
          { responseType: "arraybuffer" }
        );
        logoData = Buffer.from(response.data).toString("base64");
      } catch (error) {
        console.error("Failed to load fallback logo:", error);
      }
    }

    // --- Header Section ---
    if (logoData) {
      doc.addImage(logoData, "PNG", margin, margin, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(this.companyName, margin + 40, margin + 15); // Company name next to logo
      yPosition = margin + 40;
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(this.companyName, margin, margin + 10); // Company name alone
      yPosition = margin + 20;
    }
    // const fullName = data.firstName + ' ' + data.lastName;
    // // Add Name
    // doc.setFontSize(20);
    // doc.text(fullName, margin, yPosition);
    // yPosition += 10;

    // Contact Information
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    // doc.text(`Email: ${data.email}`, margin, yPosition);
    // doc.text(`Phone: ${data.phone}`, margin + 100, yPosition, {
    //   align: 'left',
    // });
    yPosition += 15;

    // --- Professional Summary ---
    doc.setFont("helvetica", "bold");
    doc.text("Professional Summary", margin, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "normal");

    // Fix overlapping by adjusting yPosition based on text height
    const summaryText = doc.splitTextToSize(
      data.summary,
      doc.internal.pageSize.getWidth() - margin * 2
    );
    doc.text(summaryText, margin, yPosition);
    yPosition += summaryText.length * 6 + 10;

    // --- Experience Section ---
    doc.setFont("helvetica", "bold");
    doc.text("Experience", margin, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "normal");

    data.experience.forEach((exp) => {
      doc.text(`${exp.position} at ${exp.company}`, margin, yPosition);
      yPosition += 8;
      doc.text(
        `${exp.startDate} - ${exp.endDate ? exp.endDate : "Present"}`,
        margin,
        yPosition
      );
      yPosition += 8;

      const expText = doc.splitTextToSize(
        exp.description,
        doc.internal.pageSize.getWidth() - margin * 2
      );
      doc.text(expText, margin, yPosition);
      yPosition += expText.length * 6 + 10; // Adjust for multiline text
    });

    // --- Skills Section ---
    doc.setFont("helvetica", "bold");
    doc.text("Skills", margin, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "normal");
    data.skills.forEach((skill, index) => {
      doc.text(`• ${skill}`, margin, yPosition + index * 6);
    });
    yPosition += data.skills.length * 6 + 10;

    // --- Convert to Buffer ---
    const pdfOutput = doc.output("arraybuffer");
    return Buffer.from(pdfOutput);
  }

  async generateCvPdfPuppeteer(
    data: ICvData,
    templateId: string
  ): Promise<Buffer> {
    // Resolve template path
    console.log({ templateId });

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

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
    });
    await browser.close();

    return Buffer.from(pdf);
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

  async generateCvTemplate(data: ICvData): Promise<Buffer> {
    const doc = new jsPDF();
    const margin = 15;
    let yPosition = margin;

    // Load logo (reusing the same logo loading logic from the example)
    const logoPath = path.join(
      __dirname,
      "../../../public/agency-logo-dark.png"
    );
    let logoData: string | null = null;

    if (fs.existsSync(logoPath)) {
      logoData = fs.readFileSync(logoPath).toString("base64");
    } else {
      try {
        const response = await axios.get(
          "https://media.licdn.com/dms/image/v2/D4D0BAQEEKDKGlsG4QQ/company-logo_200_200/company-logo_200_200/0/1709460920387/amygdal_logo?e=1747267200&v=beta&t=OWiJNTQkaMafxIDUGIYmJql7CT8sm8bZpOuy_qF9S8k",
          { responseType: "arraybuffer" }
        );
        logoData = Buffer.from(response.data).toString("base64");
      } catch (error) {
        console.error("Failed to load fallback logo:", error);
      }
    }

    // Header Section
    if (logoData) {
      doc.addImage(logoData, "PNG", margin, margin, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(this.companyName, margin + 40, margin + 15);
      yPosition = margin + 40;
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(this.companyName, margin, margin + 10);
      yPosition = margin + 20;
    }

    // Personal Information
    const fullName = `${data.firstName} ${data.lastName}`;
    doc.setFontSize(20);
    doc.text(fullName, margin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Email: ${data.email}`, margin, yPosition);
    doc.text(`Phone: ${data.phone}`, margin + 80, yPosition, { align: "left" });
    yPosition += 15;

    // Professional Summary
    doc.setFont("helvetica", "bold");
    doc.text("Professional Summary", margin, yPosition);
    yPosition += 10;
    doc.setFont("helvetica", "normal");

    const summaryText = doc.splitTextToSize(
      data.summary,
      doc.internal.pageSize.getWidth() - margin * 2
    );
    doc.text(summaryText, margin, yPosition);
    yPosition += summaryText.length * 6 + 15;

    // Experience
    if (data.experience.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Professional Experience", margin, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");

      data.experience.forEach((exp) => {
        doc.text(`${exp.position} at ${exp.company}`, margin, yPosition);
        yPosition += 8;
        doc.text(
          `${exp.startDate} - ${exp.endDate ? exp.endDate : "Present"}`,
          margin,
          yPosition
        );
        yPosition += 8;

        const expText = doc.splitTextToSize(
          exp.description,
          doc.internal.pageSize.getWidth() - margin * 2
        );
        doc.text(expText, margin, yPosition);
        yPosition += expText.length * 6 + 10;
      });
    }

    // Projects
    if (data.projects.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Projects", margin, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");

      data.projects.forEach((project) => {
        doc.text(project.name, margin, yPosition);
        yPosition += 8;
        const projectText = doc.splitTextToSize(
          project.description,
          doc.internal.pageSize.getWidth() - margin * 2
        );
        doc.text(projectText, margin, yPosition);
        yPosition += projectText.length * 6 + 8;

        if (project.url) {
          doc.text(`URL: ${project.url}`, margin, yPosition);
          yPosition += 8;
        }
        doc.text(
          `${project.startDate} - ${project.endDate ? project.endDate : "Present"}`,
          margin,
          yPosition
        );
        yPosition += 10;
      });
    }

    // Education
    if (data.educations.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Education", margin, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");

      data.educations.forEach((edu) => {
        doc.text(`${edu.degree} in ${edu.field}`, margin, yPosition);
        yPosition += 8;
        doc.text(edu.institution, margin, yPosition);
        yPosition += 8;
        doc.text(
          `${edu.startDate} - ${edu.endDate ? edu.endDate : "Present"}`,
          margin,
          yPosition
        );
        if (edu.grade) {
          doc.text(`Grade: ${edu.grade}`, margin + 80, yPosition, {
            align: "left",
          });
        }
        yPosition += 10;
      });
    }

    // Skills
    if (data.skills.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Skills", margin, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");

      data.skills.forEach((skill, index) => {
        doc.text(`• ${skill}`, margin, yPosition + index * 6);
      });
      yPosition += data.skills.length * 6 + 15;
    }

    // Languages
    if (data.languages.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Languages", margin, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");

      data.languages.forEach((lang, index) => {
        doc.text(
          `• ${lang.name} - ${lang.efficiency}`,
          margin,
          yPosition + index * 6
        );
      });
      yPosition += data.languages.length * 6 + 15;
    }

    // Certificates
    if (data.certificates.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Certifications", margin, yPosition);
      yPosition += 10;
      doc.setFont("helvetica", "normal");

      data.certificates.forEach((cert) => {
        doc.text(`${cert.name} - ${cert.issuer}`, margin, yPosition);
        yPosition += 8;
        doc.text(`Issued: ${cert.issueDate}`, margin, yPosition);
        if (cert.expirationDate) {
          doc.text(`Expires: ${cert.expirationDate}`, margin + 80, yPosition, {
            align: "left",
          });
        }
        if (cert.url) {
          doc.text(`URL: ${cert.url}`, margin, yPosition + 8);
          yPosition += 8;
        }
        yPosition += 10;
      });
    }

    // Socials and Hobbies can be added similarly if needed

    // Convert to Buffer
    const pdfOutput = doc.output("arraybuffer");
    return Buffer.from(pdfOutput);
  }

  //   async generateCVV2(): Promise<Buffer> {
  //     const doc = new jsPDF();

  //     // Page dimensions
  //     const pageWidth = doc.internal.pageSize.getWidth();
  //     const pageHeight = doc.internal.pageSize.getHeight();

  //     // Margins
  //     const margin = 15;

  //     // Column positions (adjust as needed)
  //     const leftColumnX = margin; // x-position for left column
  //     const rightColumnX = 120; // x-position for right column

  //     // Vertical offsets
  //     let leftColumnY = margin;
  //     let rightColumnY = margin;

  //     // -------------------------------------------------------------------------
  //     // 1. LOAD LOGO (Local file or fallback URL)
  //     // -------------------------------------------------------------------------
  //     const logoPath = path.join(
  //       __dirname,
  //       '../../../public/agency-logo-dark.png',
  //     );
  //     let logoData: string | null = null;

  //     if (fs.existsSync(logoPath)) {
  //       // Load from local file
  //       logoData = fs.readFileSync(logoPath).toString('base64');
  //     } else {
  //       // Fallback: load from remote URL
  //       try {
  //         const response = await axios.get(
  //           'https://media.licdn.com/dms/image/v2/D4D0BAQEEKDKGlsG4QQ/company-logo_200_200/company-logo_200_200/0/1709460920387/amygdal_logo?e=1747267200&v=beta&t=OWiJNTQkaMafxIDUGIYmJql7CT8sm8bZpOuy_qF9S8k',
  //           { responseType: 'arraybuffer' },
  //         );
  //         logoData = Buffer.from(response.data).toString('base64');
  //       } catch (error) {
  //         console.error('Failed to load fallback logo:', error);
  //       }
  //     }

  //     // -------------------------------------------------------------------------
  //     // 2. HEADER SECTION (Logo + Company Name)
  //     // -------------------------------------------------------------------------
  //     if (logoData) {
  //       // Add the logo at top-left
  //       // Parameters: (imageData, format, x, y, width, height)
  //       doc.addImage(logoData, 'PNG', margin, margin, 20, 20);
  //       // Company Name next to the logo
  //       doc.setFont('helvetica', 'bold');
  //       doc.setFontSize(14);
  //       doc.text('My Company, Inc.', margin + 25, margin + 15);
  //     } else {
  //       // If no logo, just put the company name at the top-left
  //       doc.setFont('helvetica', 'bold');
  //       doc.setFontSize(14);
  //       doc.text('My Company, Inc.', margin, margin + 10);
  //     }

  //     // Move the left column Y offset below the logo area
  //     leftColumnY = margin + 30;

  //     // -------------------------------------------------------------------------
  //     // 3. LEFT COLUMN CONTENT (Main CV Data)
  //     // -------------------------------------------------------------------------

  //     // --- Name and Contact Info ---
  //     doc.setFont('helvetica', 'bold');
  //     doc.setFontSize(18);
  //     doc.text('Elijah Hartley', leftColumnX, leftColumnY);
  //     leftColumnY += 8;

  //     doc.setFont('helvetica', 'normal');
  //     doc.setFontSize(10);
  //     doc.setTextColor(100);
  //     doc.text(
  //       'Florida • (734) 629-8417 • elijah@hartley.com • linkedin.com/in/elijah-hartley',
  //       leftColumnX,
  //       leftColumnY,
  //     );
  //     leftColumnY += 10;

  //     // --- Summary ---
  //     doc.setFont('helvetica', 'normal');
  //     doc.setFontSize(10);
  //     doc.setTextColor(0); // Reset text color to black
  //     doc.text(
  //       'Dedicated Node.js Developer with a proven track record of enhancing system efficiency, reducing latency, and improving user experience across various sections. Increased RESTful API performance by 15% through the development and maintenance of critical APIs and boosted customer engagement by 20% in recent roles. Seeking to leverage my knowledge in system architecture and user experience to further contribute to the technological excellence of my next team.',
  //       leftColumnX,
  //       leftColumnY,
  //       {
  //         maxWidth: 95, // keep it within the left column
  //       },
  //     );
  //     leftColumnY += 30;

  //     // --- Career Experience Header ---
  //     doc.setFont('helvetica', 'bold');
  //     doc.setFontSize(12);
  //     doc.text('CAREER EXPERIENCE', leftColumnX, leftColumnY);
  //     leftColumnY += 8;

  //     // Node JS Developer
  //     doc.setFont('helvetica', 'bold');
  //     doc.setFontSize(10);
  //     doc.text(
  //       'Node JS Developer @ DataZapp (01/2024 – Present)',
  //       leftColumnX,
  //       leftColumnY,
  //     );
  //     leftColumnY += 5;

  //     doc.setFont('helvetica', 'normal');
  //     doc.text(
  //       '- Developed a microservices-based system using Node.js and Express, resulting in a 20% reduction in latency.',
  //       leftColumnX,
  //       leftColumnY + 5,
  //       { maxWidth: 95 },
  //     );
  //     doc.text(
  //       '- Designed and maintained a suite of RESTful APIs, improving response times by 15% and leading to a 10% increase in productivity across teams.',
  //       leftColumnX,
  //       leftColumnY + 10,
  //       { maxWidth: 95 },
  //     );
  //     leftColumnY += 20;

  //     // VentureScript
  //     doc.setFont('helvetica', 'bold');
  //     doc.setFontSize(10);
  //     doc.text(
  //       'NodeJS Developer @ VentureScript (03/2023 – 12/2023)',
  //       leftColumnX,
  //       leftColumnY,
  //     );
  //     leftColumnY += 5;

  //     doc.setFont('helvetica', 'normal');
  //     doc.text(
  //       '- Spearheaded the creation of a real-time chat application using Node.js and WebSockets, resulting in near-instant communication for thousands of users.',
  //       leftColumnX,
  //       leftColumnY + 5,
  //       { maxWidth: 95 },
  //     );
  //     doc.text(
  //       '- Collaborated with front-end teams to optimize data handling, reducing load times by 25%.',
  //       leftColumnX,
  //       leftColumnY + 10,
  //       { maxWidth: 95 },
  //     );
  //     leftColumnY += 20;

  //     // Junior NodeJS Dev
  //     doc.setFont('helvetica', 'bold');
  //     doc.setFontSize(10);
  //     doc.text('Junior NodeJS Dev (11/2021 – 03/2023)', leftColumnX, leftColumnY);
  //     leftColumnY += 5;

  //     doc.setFont('helvetica', 'normal');
  //     doc.text(
  //       '- Participated in process optimization and agile project planning, contributing to a 15% decrease in overall sprint times.',
  //       leftColumnX,
  //       leftColumnY + 5,
  //       { maxWidth: 95 },
  //     );
  //     doc.text(
  //       '- Built RESTful APIs using Node.js and Express, focusing on performance tuning and best coding practices.',
  //       leftColumnX,
  //       leftColumnY + 10,
  //       { maxWidth: 95 },
  //     );
  //     leftColumnY += 20;

  //     // -------------------------------------------------------------------------
  //     // 4. RIGHT COLUMN CONTENT (Skills, Education, etc.)
  //     // -------------------------------------------------------------------------
  //     // Skills
  //     doc.setFont('helvetica', 'bold');
  //     doc.setFontSize(12);
  //     doc.text('SKILLS', rightColumnX, rightColumnY);
  //     rightColumnY += 8;

  //     doc.setFont('helvetica', 'normal');
  //     doc.setFontSize(10);
  //     const skillsList = [
  //       'Node.js',
  //       'Express',
  //       'RESTful APIs: Design & Maintenance',
  //       'Database: MySQL, MongoDB',
  //       'DevOps: Docker, AWS',
  //       'Version Control: Git, GitHub',
  //     ];
  //     skillsList.forEach((skill, index) => {
  //       doc.text(`- ${skill}`, rightColumnX, rightColumnY + 5 * (index + 1), {
  //         maxWidth: pageWidth - rightColumnX - margin,
  //       });
  //     });
  //     rightColumnY += 5 * (skillsList.length + 1) + 5;

  //     // Education
  //     doc.setFont('helvetica', 'bold');
  //     doc.setFontSize(12);
  //     doc.text('EDUCATION', rightColumnX, rightColumnY);
  //     rightColumnY += 8;

  //     doc.setFont('helvetica', 'normal');
  //     doc.setFontSize(10);
  //     doc.text('BS in Computer Science', rightColumnX, rightColumnY);
  //     rightColumnY += 5;
  //     doc.text('University of Florida (2015 – 2019)', rightColumnX, rightColumnY);
  //     rightColumnY += 10;

  //     doc.text('Certificates:', rightColumnX, rightColumnY);
  //     rightColumnY += 5;
  //     doc.text('- Microsoft Azure Fundamentals', rightColumnX, rightColumnY);
  //     rightColumnY += 5;
  //     doc.text('- AWS Certified Cloud Practitioner', rightColumnX, rightColumnY);
  //     rightColumnY += 5;

  //     // -------------------------------------------------------------------------
  //     // 5. Convert the document to a Buffer and return
  //     // -------------------------------------------------------------------------
  //     const pdfOutput = doc.output('arraybuffer');
  //     return Buffer.from(pdfOutput);
  //   }

  async generateCVV2(): Promise<Buffer> {
    // usning auto-table
    const doc = new jsPDF();

    // Page dimensions and margins
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const leftColumnX = margin;
    const rightColumnX = 120;
    let leftColumnY = margin;
    let rightColumnY = margin;

    // -------------------------------------------------------------------------
    // 1. LOAD LOGO (Local file or fallback URL)
    // -------------------------------------------------------------------------
    const logoPath = path.join(
      __dirname,
      "../../../public/agency-logo-dark.png"
    );
    let logoData: string | null = null;

    if (fs.existsSync(logoPath)) {
      logoData = fs.readFileSync(logoPath).toString("base64");
    } else {
      try {
        const response = await axios.get(
          "https://media.licdn.com/dms/image/v2/D4D0BAQEEKDKGlsG4QQ/company-logo_200_200/company-logo_200_200/0/1709460920387/amygdal_logo?e=1747267200&v=beta&t=OWiJNTQkaMafxIDUGIYmJql7CT8sm8bZpOuy_qF9S8k",
          { responseType: "arraybuffer" }
        );
        logoData = Buffer.from(response.data).toString("base64");
      } catch (error) {
        console.error("Failed to load fallback logo:", error);
      }
    }

    // -------------------------------------------------------------------------
    // 2. HEADER SECTION (Logo + Company Name)
    // -------------------------------------------------------------------------
    const companyName = "My Company, Inc.";
    if (logoData) {
      // Add logo at top-left (x, y, width, height)
      doc.addImage(logoData, "PNG", margin, margin, 20, 20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(companyName, margin + 25, margin + 15);
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(companyName, margin, margin + 10);
    }
    // Move left column below the header area
    leftColumnY = margin + 30;

    // -------------------------------------------------------------------------
    // 3. LEFT COLUMN CONTENT (Main CV Data)
    // -------------------------------------------------------------------------
    // Replace hard-coded text with variables
    const candidateName = "Elijah Hartley";
    const candidateTitle = "Senior Software Developer";
    const candidateContact =
      "Florida • (734) 629-8417 • elijah@hartley.com • linkedin.com/in/elijah-hartley";
    const candidateSummary =
      "Dedicated Node.js Developer with a proven track record of enhancing system efficiency, reducing latency, and improving user experience across various sections. Increased RESTful API performance by 15% through the development and maintenance of critical APIs and boosted customer engagement by 20% in recent roles. Seeking to leverage my knowledge in system architecture and user experience to further contribute to the technological excellence of my next team.";

    // Experience data as an array of objects
    const experience = [
      {
        title: "Node JS Developer @ DataZapp",
        duration: "01/2024 – Present",
        description: [
          "Developed a microservices-based system using Node.js and Express, resulting in a 20% reduction in latency.",
          "Designed and maintained a suite of RESTful APIs, improving response times by 15% and leading to a 10% increase in productivity across teams.",
        ],
      },
      {
        title: "NodeJS Developer @ VentureScript",
        duration: "03/2023 – 12/2023",
        description: [
          "Spearheaded the creation of a real-time chat application using Node.js and WebSockets, resulting in near-instant communication for thousands of users.",
          "Collaborated with front-end teams to optimize data handling, reducing load times by 25%.",
        ],
      },
      {
        title: "Junior NodeJS Dev",
        duration: "11/2021 – 03/2023",
        description: [
          "Participated in process optimization and agile project planning, contributing to a 15% decrease in overall sprint times.",
          "Built RESTful APIs using Node.js and Express, focusing on performance tuning and best coding practices.",
        ],
      },
    ];

    // Left column: Name and Contact Info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(candidateName, leftColumnX, leftColumnY);
    leftColumnY += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(candidateTitle, leftColumnX, leftColumnY);
    leftColumnY += 8;
    doc.text(candidateContact, leftColumnX, leftColumnY);
    leftColumnY += 10;

    // Summary using autoTable for multi-line handling
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0);
    autoTable(doc, {
      startY: leftColumnY,
      margin: { left: leftColumnX },
      tableWidth: 95,
      theme: "plain",
      styles: { font: "helvetica", fontSize: 10 },
      body: [[candidateSummary]],
    });
    leftColumnY = (doc as any).lastAutoTable.finalY + 10;

    // Career Experience Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("CAREER EXPERIENCE", leftColumnX, leftColumnY);
    leftColumnY += 8;

    // Prepare experience rows for autoTable.
    // Each row will have the position/duration and the description (joined with newlines)
    const expRows = experience.map((exp) => [
      `${exp.title} (${exp.duration})`,
      exp.description.join("\n"),
    ]);

    autoTable(doc, {
      startY: leftColumnY,
      margin: { left: leftColumnX },
      tableWidth: 95,
      head: [["Position & Duration", "Description"]],
      body: expRows,
      theme: "grid",
      styles: { font: "helvetica", fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    leftColumnY = (doc as any).lastAutoTable.finalY + 10;

    // -------------------------------------------------------------------------
    // 4. RIGHT COLUMN CONTENT (Skills, Education, Certificates)
    // -------------------------------------------------------------------------
    // Skills data
    const skills = [
      "Node.js",
      "Express",
      "RESTful APIs: Design & Maintenance",
      "Database: MySQL, MongoDB",
      "DevOps: Docker, AWS",
      "Version Control: Git, GitHub",
    ];

    // Education data
    const education = {
      degree: "BS in Computer Science",
      institution: "University of Florida",
      period: "2015 – 2019",
    };

    // Certificates data
    const certificates = [
      "Microsoft Azure Fundamentals",
      "AWS Certified Cloud Practitioner",
    ];

    // Skills
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("SKILLS", rightColumnX, rightColumnY);
    rightColumnY += 8;
    const skillsRows = skills.map((skill) => [skill]);
    autoTable(doc, {
      startY: rightColumnY,
      margin: { left: rightColumnX },
      head: [["Skills"]],
      body: skillsRows,
      theme: "plain",
      styles: { font: "helvetica", fontSize: 10 },
    });
    rightColumnY = (doc as any).lastAutoTable.finalY + 10;

    // Education
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("EDUCATION", rightColumnX, rightColumnY);
    rightColumnY += 8;
    autoTable(doc, {
      startY: rightColumnY,
      margin: { left: rightColumnX },
      head: [["Education"]],
      body: [
        [education.degree, `${education.institution} (${education.period})`],
      ],
      theme: "plain",
      styles: { font: "helvetica", fontSize: 10 },
    });
    rightColumnY = (doc as any).lastAutoTable.finalY + 10;

    // Certificates
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("CERTIFICATES", rightColumnX, rightColumnY);
    rightColumnY += 8;
    const certRows = certificates.map((cert) => [cert]);
    autoTable(doc, {
      startY: rightColumnY,
      margin: { left: rightColumnX },
      head: [["Certificates"]],
      body: certRows,
      theme: "plain",
      styles: { font: "helvetica", fontSize: 10 },
    });
    rightColumnY = (doc as any).lastAutoTable.finalY + 10;

    // -------------------------------------------------------------------------
    // 5. Convert the document to a Buffer and return
    // -------------------------------------------------------------------------
    const pdfOutput = doc.output("arraybuffer");
    return Buffer.from(pdfOutput);
  }
}
