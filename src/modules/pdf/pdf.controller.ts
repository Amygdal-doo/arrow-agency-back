import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Res,
  Response,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { PdfService } from "./pdf.service";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiHideProperty,
  ApiOperation,
} from "@nestjs/swagger";
import { ICvData } from "./interfaces/cv-data.interface";
import { createPdfDto } from "./dtos/create-pdf.dto";

@Controller("pdf")
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  // @Post('upload-file/pdf')
  // // @UseGuards(AccessTokenGuard)
  // // @ApiBearerAuth('Access Token')
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiBody({
  //   description: 'List of cats',
  //   type: UploadPdfFileDto,
  // })
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file, 111);
  //   return 'ssss';
  // }

  // @Post("upload")
  // @ApiOperation({
  //   summary: "Upload a pdf file",
  //   description: "Upload a Cv that is in pdf format",
  // })
  // //   @UseFilters(new HttpExceptionFilter())
  // @ApiConsumes("multipart/form-data")
  // @UseInterceptors(FileInterceptor("file"))
  // async savePdfToJson(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), //5 mb
  //         new FileTypeValidator({ fileType: "application/pdf" }),
  //       ],
  //     })
  //   )
  //   file: Express.Multer.File,
  //   @Response() res: any
  // ) {
  //   console.log(file);

  //   const cvData = await this.pdfService.savePdfToJson(file);

  //   // const pdfBuffer = await this.pdfService.generateCV();

  //   // Sample data; replace with your own dynamic data as needed
  //   // const cvData: ICvData = {
  //   //   firstName: 'John',
  //   //   lastName: 'Doe',
  //   //   email: 'john.doe@example.com',
  //   //   phone: '123-456-7890',
  //   //   summary:
  //   //     'Experienced software developer with a passion for building scalable applications.',
  //   //   skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
  //   //   experience: [
  //   //     {
  //   //       position: 'Software Engineer',
  //   //       company: 'Tech Corp',
  //   //       startDate: 'Jan 2020',
  //   //       endDate: 'Present',
  //   //       description:
  //   //         'Developed various web applications using modern frameworks.',
  //   //     },
  //   //     // Add more experience items if needed
  //   //   ],
  //   // };

  //   const pdfBuffer = await this.pdfService.generateCvPdf(cvData);
  //   // const pdfBuffer = await this.pdfService.generateCVV2();

  //   res.set({
  //     "Content-Type": "application/pdf",
  //     "Content-Disposition": `attachment; filename="cv-${file.filename}.pdf"`,
  //     "Content-Length": pdfBuffer.length,
  //   });
  //   res.end(pdfBuffer);

  //   // return '{\n  "contact": "www.linkedin.com/in/fadil-šestan-535162226",\n  "top_skills": [\n    "Front-End Development",\n    "HTML",\n    "Cascading Style Sheets (CSS)"\n  ],\n  "name": "Fadil Šestan",\n  "position": "Frontend Web Developer",\n  "company": "Amygdal",\n  "location": "Gračanica, Federation of Bosnia and Herzegovina, Bosnia and Herzegovina",\n  "summary": {\n    "introduction": "Hello! Welcome to my LinkedIn profile.",\n    "experience": "I am a frontend Vue developer with a passion for creating engaging and interactive user experiences.",\n    "years_of_experience": "3+ years",\n    "specialization": "Building dynamic and responsive applications using Vue.js",\n    "expertise": {\n      "Vue.js": "Deep understanding of Vue.js framework and its ecosystem, capable of developing single-page applications (SPAs) and integrating complex UI components.",\n      "HTML/CSS": "Proficient in HTML5 and CSS3, ensuring pixel-perfect implementation of UI designs with attention to responsive web design principles.",\n      "JavaScript": "Strong foundation in JavaScript, familiar with ES6+ syntax and modern frameworks/libraries.",\n      "UI/UX Design": "Understanding of user-centered design principles, collaborating closely with designers.",\n      "RESTful APIs": "Experience in integrating frontend applications with RESTful APIs for seamless data exchange.",\n      "Testing and Debugging": "Well-versed in unit testing frameworks such as Jest and optimizing applications for performance.",\n      "Version Control": "Proficient in Git for efficient collaboration and code management.",\n      "additional_frameworks": [\n        "React.js",\n        "Astro.js",\n        "Next.js"\n      ]\n    },\n    "collaboration": "Thrives in collaborative environments and enjoys tackling complex challenges."\n  },\n  "experience": [\n    {\n      "company": "Amygdal",\n      "position": "Frontend Web Developer",\n      "duration": "December 2021 - Present",\n      "location": "Sarajevo, Federation of Bosnia and Herzegovina, Bosnia and Herzegovina"\n    },\n    {\n      "company": "Plutus",\n      "position": "Frontend Web Developer",\n      "duration": "February 2021 - March 2021",\n      "location": "Germany",\n      "description": "The online video platform, learning platform made for older people."\n    },\n    {\n      "company": "NSoft Company",\n      "position": "Internship Frontend Web Developer",\n      "duration": "June 2020 - September 2020"\n    }\n  ],\n  "education": [\n    {\n      "institution": "Visoka poslovno tehnička škola Doboj",\n      "degree": "Bachelor\'s degree",\n      "field_of_study": "Computer and Information Sciences, General",\n      "duration": "September 2018 - September 2022"\n    },\n    {\n      "institution": "SPARK School",\n      "degree": "Web Development",\n      "duration": "September 2019 - December 2020"\n    },\n    {\n      "institution": "Gimnazija \'Dr. Mustafa Kamarić\' Gračanica",\n      "duration": "2014 - 2018"\n    }\n  ]\n}';
  // }

  @Post("generate-cv")
  @ApiOperation({ summary: "Generate CV" })
  @ApiConsumes("aplication/json")
  @ApiBody({ type: createPdfDto })
  async generateCv(@Body() body: createPdfDto, @Res() res: any) {
    try {
      const pdf = await this.pdfService.generateCvPdfPuppeteer(
        body.data,
        body.templateId
      );
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=cv.pdf",
        "Content-Length": pdf.length.toString(),
      });
      res.send(pdf);
    } catch (error) {
      res.status(500).send(`Error generating PDF: ${error.message}`);
    }
  }
}
