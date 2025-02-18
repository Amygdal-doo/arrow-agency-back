import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { PdfService } from "../pdf/pdf.service";
import { UploadDto } from "../pdf/dtos/upload.dto";
import { ILoggedUserInfo } from "../auth/interfaces/logged-user-info.interface";
import { ICvData } from "../pdf/interfaces/cv-data.interface";
import { SpacesService } from "../spaces/spaces.service";
import { IUploadedFile } from "../spaces/interfaces/iuploaded-file.interface";
import { SpacesDestinationPath } from "../spaces/enums/spaces-folder-name.enum";

@Injectable()
export class ApplicantService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly pdfService: PdfService,
    private readonly spacesService: SpacesService
  ) {}

  // DB Queries

  async create(data: Prisma.ApplicantCreateInput) {
    return this.databaseService.applicant.create({ data });
  }

  async findById(id: string) {
    return this.databaseService.applicant.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.databaseService.applicant.findMany({ where: { email } });
  }

  async findByUserId(userId: string) {
    return this.databaseService.applicant.findMany({
      where: { userId },
      include: {
        file: true,
      },
    });
  }

  async findAll() {
    return this.databaseService.applicant.findMany();
  }

  // Bussiness logic

  async generatePdfAndSave(
    loggedUserInfo: ILoggedUserInfo,
    file: Express.Multer.File,
    body: UploadDto
  ): Promise<Buffer> {
    const pdfData = await this.pdfService.savePdfToJson(file);

    console.log({ pdfData, body });
    const cvData: ICvData = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      summary: pdfData.summary,
      skills: Array.from(new Set([...pdfData.skills, ...body.technologies])),
      experience: pdfData.experience,
    };
    const pdfBuffer = await this.pdfService.generateCvPdf(cvData);

    let pdfFile: IUploadedFile | null = null;
    try {
      if (file) {
        pdfFile = await this.spacesService.uploadFileBuffer(
          pdfBuffer,
          `${body.name}_${body.surname}`,
          SpacesDestinationPath.PDF
        );
      }
    } catch (error) {
      throw new BadRequestException("Something went wrong with file upload");
    }

    const newApplicant = await this.create({
      user: { connect: { id: loggedUserInfo.id } },
      firstName: body.name,
      lastName: body.surname,
      email: body.email,
      phone: body.phone,
      technologies: body.technologies,
      cvData: JSON.parse(JSON.stringify(pdfData)),
      file: {
        create: {
          name: pdfFile.name,
          url: pdfFile.url,
          extension: pdfFile.extension,
          fileCreatedAt: pdfFile.createdAt,
          user: {
            connect: { id: loggedUserInfo.id },
          },
        },
      },
    });
    console.log({ newApplicant });
    return pdfBuffer;
  }

  async getApplicantCvById(loggedUserInfo: ILoggedUserInfo, id: string) {
    const applicant = await this.databaseService.applicant.findUnique({
      where: { id, userId: loggedUserInfo.id },
    });

    if (!applicant) {
      throw new BadRequestException("Applicant not found");
    }

    const pdfBuffer = await this.pdfService.generateCvPdfAny(applicant.cvData);

    return pdfBuffer;
  }
}
