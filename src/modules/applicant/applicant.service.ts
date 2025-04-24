import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { PdfService } from "../pdf/pdf.service";
import { UploadDto } from "../pdf/dtos/upload.dto";
import { ILoggedUserInfo } from "../auth/interfaces/logged-user-info.interface";
import { ICvData, ICvDataExtended } from "../pdf/interfaces/cv-data.interface";
import { SpacesService } from "../spaces/spaces.service";
import { IUploadedFile } from "../spaces/interfaces/file-upload.interface";
import { SpacesDestinationPath } from "../spaces/enums/spaces-folder-name.enum";
import {
  ApplicantsBytechnologiesDto,
  OrderType,
  PaginationQueryDto,
  PaginationResponseDto,
} from "src/common/dtos/pagination.dto";
import { SortOrder } from "src/common/enums/order.enum";
import { pageLimit } from "src/common/helper/pagination.helper";
import { checkFileExists } from "src/common/helper/file-exist.helper";

@Injectable()
export class ApplicantService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly pdfService: PdfService,
    private readonly spacesService: SpacesService
    // private readonly tesseractService: TesseractService
  ) {}

  private readonly logger = new Logger(ApplicantService.name);

  // DB Queries

  async create(data: Prisma.ApplicantCreateInput) {
    return this.databaseService.applicant.create({ data });
  }

  async findById(id: string) {
    return this.databaseService.applicant.findUnique({ where: { id } });
  }

  async findOne(id: string, userId: string) {
    const result = await this.databaseService.applicant.findUnique({
      where: {
        id,
        userId,
      },
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
            companyLogo: true,
            skills: true,
          },
        },
      },
    });
    return result;
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
      // include: {
      //   file: true,
      //   cv: {
      //     include: {
      //       experience: true,
      //       projects: true,
      //       educations: true,
      //       certificates: true,
      //       languages: true,
      //       socials: true,
      //       courses: true,
      //     },
      //   },
      // },
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

  // async generatePdfAndSave(
  //   loggedUserInfo: ILoggedUserInfo,
  //   file: Express.Multer.File,
  //   body: UploadDto
  // ): Promise<Buffer> {
  //   const pdfData = await this.pdfService.savePdfToJson(file);

  //   // const skillsOnly = pdfData.skills.map((skill) => skill.name);

  //   const technologies = body.technologies.map((skill) => skill.toUpperCase());
  //   const skills = pdfData.skills.filter((skill) => {
  //     skill.name.toUpperCase();
  //     skill.efficiency ?? "null";
  //   });

  //   console.log({ pdfData, body });
  //   const cvData: ICvData = {
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //     phone: "",
  //     summary: pdfData.summary,
  //     skills: skills,
  //     experience: pdfData.experience,
  //     projects: pdfData.projects,
  //     educations: pdfData.educations,
  //     certificates: pdfData.certificates,
  //     hobies: pdfData.hobies,

  //     languages: pdfData.languages,
  //     socials: pdfData.socials,
  //     courses: pdfData.courses,
  //   };
  //   // const pdfBuffer = await this.pdfService.generateCvPdf(cvData);

  //   const pdfBuffer = await this.pdfService.generateCvTemplate(cvData);

  //   let pdfFile: IUploadedFile | null = null;
  //   try {
  //     if (file) {
  //       pdfFile = await this.spacesService.uploadFileBuffer(
  //         pdfBuffer,
  //         `${body.name}_${body.surname}`,
  //         SpacesDestinationPath.PDF
  //       );
  //     }
  //   } catch (error) {
  //     throw new BadRequestException("Something went wrong with file upload");
  //   }

  //   const newApplicant = await this.create({
  //     user: { connect: { id: loggedUserInfo.id } },
  //     firstName: body.name,
  //     lastName: body.surname,
  //     email: body.email,
  //     phone: body.phone,
  //     technologies: technologies,
  //     cv: {
  //       create: {
  //         firstName: pdfData.firstName,
  //         lastName: pdfData.lastName,
  //         email: pdfData.email,
  //         phone: pdfData.phone,
  //         summary: pdfData.summary,
  //         skills: {
  //           create: skills,
  //         },
  //         hobbies: pdfData.hobies,
  //         experience: {
  //           create: pdfData.experience,
  //         },
  //         projects: {
  //           create: pdfData.projects,
  //         },
  //         educations: {
  //           create: pdfData.educations,
  //         },
  //         certificates: {
  //           create: pdfData.certificates,
  //         },
  //         languages: {
  //           create: pdfData.languages,
  //         },
  //         socials: {
  //           create: pdfData.socials,
  //         },
  //         courses: {
  //           create: pdfData.courses,
  //         },
  //       },
  //     },
  //     file: {
  //       create: {
  //         name: pdfFile.name,
  //         url: pdfFile.url,
  //         extension: pdfFile.extension,
  //         fileCreatedAt: pdfFile.createdAt,
  //         user: {
  //           connect: { id: loggedUserInfo.id },
  //         },
  //       },
  //     },
  //   });
  //   console.log({ newApplicant });
  //   return pdfBuffer;
  // }

  async generatePdfAndSaveV2(
    loggedUserInfo: ILoggedUserInfo,
    file: Express.Multer.File,
    body: UploadDto
  ): Promise<Buffer> {
    const { templateId, logoId, companyName, publicCv, ...rest } = body;
    const exists = await checkFileExists(templateId);
    if (!exists) throw new BadRequestException("Template not found");

    // let pdfData = await this.pdfService.savePdfFileToJson(file);
    let pdfData = await this.pdfService.savePdfFileToJsonDivided(file);
    if (!pdfData) {
      // pdfData = await this.tesseractService.savePdfImageToJson(file);
      this.logger.log("First Method failed, trying OCR method...");
      pdfData = await this.pdfService.savePdfImageToJsonDivided(file);
      if (!pdfData) {
        throw new BadRequestException(
          "Pdf file doesnt contain enough data/text"
        );
      }
    }

    // let pdfData = await this.pdfService.savePdfImageToJsonDivided(file);
    // if (!pdfData) {
    //   throw new BadRequestException("Pdf file doesnt contain enough data/text");
    // }

    const image = await this.databaseService.file.findUnique({
      where: {
        id: logoId,
      },
    });
    if (!image || image.userId !== loggedUserInfo.id)
      throw new BadRequestException("Logo not found");

    // const skillsOnly = pdfData.skills.map((skill) => skill.name);

    const technologies = body.technologies.map((skill) => skill.toUpperCase());

    // console.log({ pdfData, body });
    const cvData: ICvDataExtended = {
      firstName: pdfData.firstName,
      lastName: pdfData.lastName,

      companyName: companyName,
      companyLogoUrl: image.url,

      primaryColor: rest.primaryColor,
      secondaryColor: rest.secondaryColor,
      tertiaryColor: rest.tertiaryColor,
      fontSize: rest?.fontSize ? rest.fontSize : "12px",

      showCompanyInfo: rest.showCompanyInfo,
      showPersonalInfo: rest.showPersonalInfo,

      email: pdfData.email,
      phone: pdfData.phone,
      summary: pdfData.summary,
      skills: pdfData.skills,
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

    const pdfBuffer = await this.pdfService.generateCvPdfPuppeteer(
      cvData,
      templateId
    );

    let pdfFile: IUploadedFile | null = null;
    try {
      if (file) {
        pdfFile = await this.spacesService.uploadFileBuffer(
          pdfBuffer,
          `${rest.name}_${rest.surname}`,
          SpacesDestinationPath.PDF
        );
      }
    } catch (error) {
      throw new BadRequestException("Something went wrong with file upload");
    }

    await this.create({
      user: { connect: { id: loggedUserInfo.id } },
      firstName: rest.name,
      lastName: rest.surname,
      email: rest.email,
      phone: rest.phone,
      templateId: templateId,
      technologies: technologies,
      publicCv: publicCv,
      cv: {
        create: {
          firstName: pdfData.firstName,
          lastName: pdfData.lastName,
          email: pdfData.email,
          phone: pdfData.phone,
          summary: pdfData.summary,
          primaryColor: rest.primaryColor,
          secondaryColor: rest.secondaryColor,
          tertiaryColor: rest.tertiaryColor,
          fontSize: rest?.fontSize ? rest.fontSize : "12px",
          showCompanyInfo: rest.showCompanyInfo,
          showPersonalInfo: rest.showPersonalInfo,
          companyName,
          companyLogo: {
            connect: { id: logoId },
          },
          skills: {
            create: pdfData.skills,
          },
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
    // console.log({ newApplicant });
    return pdfBuffer;
  }

  async generatePdfAndSaveV2NoFile(
    loggedUserInfo: ILoggedUserInfo,
    body: UploadDto
  ): Promise<Buffer> {
    const { templateId, logoId, companyName, publicCv, ...rest } = body;
    const exists = await checkFileExists(templateId);
    if (!exists) throw new BadRequestException("Template not found");

    const image = await this.databaseService.file.findUnique({
      where: {
        id: logoId,
      },
    });
    if (!image || image.userId !== loggedUserInfo.id)
      throw new BadRequestException("Logo not found");

    // const skillsOnly = pdfData.skills.map((skill) => skill.name);

    const technologies = body.technologies.map((skill) => skill.toUpperCase());
    // console.log({ pdfData, body });
    const cvData: ICvDataExtended = {
      firstName: rest.name,
      lastName: rest.surname,

      companyName: companyName,
      companyLogoUrl: image.url,

      primaryColor: rest.primaryColor,
      secondaryColor: rest.secondaryColor,
      tertiaryColor: rest.tertiaryColor,
      fontSize: rest?.fontSize ? rest.fontSize : "12px",

      showCompanyInfo: rest.showCompanyInfo,
      showPersonalInfo: rest.showPersonalInfo,

      email: rest.email,
      phone: rest.phone,
      summary: "",
      skills: [],
      experience: [],
      projects: [],
      educations: [],
      certificates: [],
      hobies: [],

      languages: [],
      socials: [],
      courses: [],
    };
    // const pdfBuffer = await this.pdfService.generateCvPdf(cvData);

    const pdfBuffer = await this.pdfService.generateCvPdfPuppeteer(
      cvData,
      templateId
    );

    let pdfFile: IUploadedFile | null = null;
    try {
      pdfFile = await this.spacesService.uploadFileBuffer(
        pdfBuffer,
        `${rest.name}_${rest.surname}`,
        SpacesDestinationPath.PDF
      );
    } catch (error) {
      throw new BadRequestException("Something went wrong with file upload");
    }

    await this.create({
      user: { connect: { id: loggedUserInfo.id } },
      firstName: rest.name,
      lastName: rest.surname,
      email: rest.email,
      phone: rest.phone,
      templateId: templateId,
      technologies: technologies,
      publicCv: publicCv,
      cv: {
        create: {
          firstName: rest.name,
          lastName: rest.surname,
          email: rest.email,
          phone: rest.phone,
          summary: "",
          primaryColor: rest.primaryColor,
          secondaryColor: rest.secondaryColor,
          tertiaryColor: rest.tertiaryColor,
          fontSize: rest?.fontSize ? rest.fontSize : "12px",
          showCompanyInfo: rest.showCompanyInfo,
          showPersonalInfo: rest.showPersonalInfo,
          companyName,
          companyLogo: {
            connect: { id: logoId },
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
    // console.log({ newApplicant });
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
