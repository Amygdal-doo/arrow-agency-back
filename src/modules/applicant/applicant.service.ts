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
import {
  ApplicantsBytechnologiesDto,
  OrderType,
  PaginationQueryDto,
  PaginationResponseDto,
} from "src/common/dtos/pagination.dto";
import { SortOrder } from "src/common/enums/order.enum";
import { pageLimit } from "src/common/helper/pagination.helper";

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

  async userApplicantsPaginated(
    userId: string,
    paginationQuery: PaginationQueryDto,
    orderType: OrderType,
    applicantsBytechnologiesDto: ApplicantsBytechnologiesDto
  ): Promise<PaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = "email";
    const query: Prisma.ApplicantFindManyArgs = {
      where: {
        userId,
        // name: { contains: paginationQuery.name, mode: 'insensitive' },
      },
    };

    if (
      applicantsBytechnologiesDto?.technologies &&
      applicantsBytechnologiesDto.technologies.length > 0
    ) {
      query.where.technologies = {
        hasSome: applicantsBytechnologiesDto.technologies,
        // hasEvery: applicantsBytechnologiesDto.technologies,
      };
    }

    const { page, limit } = pageLimit(paginationQuery);
    const total = await this.databaseService.applicant.count({
      where: query.where,
    });

    const pages = Math.ceil(total / limit);
    const startIndex = page < 1 ? 0 : (page - 1) * limit;

    const results = await this.databaseService.applicant.findMany({
      include: {
        file: true,
        cv: {
          include: {
            experience: true,
            projects: true,
            educations: true,
            certificates: true,
            languages: true,
            socials: true,
            courses: true,
          },
        },
      },
      where: query.where,
      skip: startIndex,
      take: limit,
      orderBy: {
        [orderBy]: orderIn,
      },
    });
    return { limit, page, pages, total, results };
  }

  async findAllApplicantsPaginated(
    paginationQuery: PaginationQueryDto,
    orderType: OrderType
  ) {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = "email";
    const query: Prisma.ApplicantFindManyArgs = {
      where: {
        // name: { contains: paginationQuery.name, mode: 'insensitive' },
      },
    };

    const { page, limit } = pageLimit(paginationQuery);
    const total = await this.databaseService.applicant.count({
      where: query.where,
    });

    const pages = Math.ceil(total / limit);
    const startIndex = page < 1 ? 0 : (page - 1) * limit;

    const results = await this.databaseService.applicant.findMany({
      include: {
        file: true,
        cv: {
          include: {
            experience: true,
            projects: true,
            educations: true,
            certificates: true,
            languages: true,
            socials: true,
            courses: true,
          },
        },
      },
      where: query.where,
      skip: startIndex,
      take: limit,
      orderBy: {
        [orderBy]: orderIn,
      },
    });
    return { limit, page, pages, total, results };
  }

  async generatePdfAndSave(
    loggedUserInfo: ILoggedUserInfo,
    file: Express.Multer.File,
    body: UploadDto
  ): Promise<Buffer> {
    const pdfData = await this.pdfService.savePdfToJson(file);

    const skills = Array.from(
      new Set([
        ...pdfData.skills.map((skill) => skill.toUpperCase()),
        ...body.technologies.map((skill) => skill.toUpperCase()),
      ])
    );

    console.log({ pdfData, body });
    const cvData: ICvData = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      summary: pdfData.summary,
      skills: skills,
      experience: pdfData.experience,
      projects: pdfData.projects,
      educations: pdfData.educations,
      certificates: pdfData.certificates,
      hobies: pdfData.hobies,

      languages: pdfData.languages,
      socials: pdfData.socials,
      courses: pdfData.courses,
    };
    // const pdfBuffer = await this.pdfService.generateCvPdf(cvData);

    const pdfBuffer = await this.pdfService.generateCvTemplate(cvData);

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
      technologies: skills,
      cv: {
        create: {
          firstName: pdfData.firstName,
          lastName: pdfData.lastName,
          email: pdfData.email,
          phone: pdfData.phone,
          summary: pdfData.summary,
          skills: pdfData.skills,
          hobbies: pdfData.hobies,
          experience: {
            create: pdfData.experience,
          },
          projects: {
            create: pdfData.projects,
          },
          educations: {
            create: pdfData.educations,
          },
          certificates: {
            create: pdfData.certificates,
          },
          languages: {
            create: pdfData.languages,
          },
          socials: {
            create: pdfData.socials,
          },
          courses: {
            create: pdfData.courses,
          },
        },
      },
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

  // async getApplicantCvById(loggedUserInfo: ILoggedUserInfo, applicantId: string) {
  //   const applicant = await this.databaseService.applicant.findUnique({
  //     where: { id: applicantId, userId: loggedUserInfo.id },
  //     include: {
  //       cv: {
  //         include: {
  //           experience: true,
  //           projects: true,
  //           educations: true,
  //           certificates: true,
  //           languages: true,
  //           socials: true,
  //           courses: true,
  //         },
  //       },
  //     }
  //   });

  //   if (!applicant) {
  //     throw new BadRequestException("Applicant not found");
  //   }
  //   const cvData: ICvData = {
  //     firstName: applicant.firstName,
  //     lastName: applicant.lastName,
  //     email: applicant.email,
  //     phone: applicant.phone,
  //     hobies: applicant.cv.hobbies,
  //     summary: applicant.cv.summary,
  //     skills: applicant.cv.skills,
  //     experience: applicant.cv.experience,
  //     projects: applicant.cv.projects,
  //     educations: applicant.cv.educations,
  //     certificates: applicant.cv.certificates,

  //     languages: applicant.cv.languages,
  //   }

  //   const pdfBuffer = await this.pdfService.generateCvTemplate(cv);

  //   return pdfBuffer;
  // }
}
