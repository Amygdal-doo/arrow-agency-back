import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { UpdateCvDto } from "../dtos/requests/update/update_cv.body.dto";
import { DeleteCvFieldsByIdDto } from "../dtos/requests/delete_cv_fields_by_id.dto";
import {
  ICvData,
  ICvDataExtended,
} from "src/modules/pdf/interfaces/cv-data.interface";
import { CvResponseDto } from "../dtos/responses/cv.response.dto";
import { IUploadedFile } from "src/modules/spaces/interfaces/file-upload.interface";
import { SpacesService } from "src/modules/spaces/spaces.service";
import { PdfService } from "src/modules/pdf/pdf.service";
import { SpacesDestinationPath } from "src/modules/spaces/enums/spaces-folder-name.enum";
import { checkFileExists } from "src/common/helper/file-exist.helper";

@Injectable()
export class CvService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly spacesService: SpacesService,
    private readonly pdfService: PdfService
  ) {}

  async updateCv(
    userId: string,
    id: string,
    updateCvDto: UpdateCvDto,
    templateId: string
  ) {
    const { publicCv, ...rest } = updateCvDto;
    // Fetch the CV with its Applicant and User
    const cv = await this.databaseService.cv.findUnique({
      where: { id },
      include: {
        applicant: { include: { user: true, file: true } },
        companyLogo: true,
      },
    });

    if (!cv) {
      throw new ForbiddenException("CV not found");
    }

    if (cv.applicant?.userId !== userId) {
      throw new ForbiddenException("You are not authorized to update this CV");
    }

    const fileExists = await checkFileExists(templateId);
    if (!fileExists) throw new BadRequestException("Template not found");

    let companyLogoUpdate = undefined;

    if (rest.companyLogoId) {
      if (cv.companyLogo.id !== rest.companyLogoId) {
        const logo = await this.databaseService.file.findUnique({
          where: {
            id: rest.companyLogoId,
            userId,
          },
        });
        if (!logo) {
          throw new BadRequestException("Logo not found");
        }
        companyLogoUpdate = rest.companyLogoId;
      }
    }

    // Delete fields
    await this.deleteFields(rest.delete, id);

    // const skills = updateCvDto.skills.map((skill) => skill.toUpperCase());
    const defaultUUID = "00000000-0000-0000-0000-000000000000";
    // Update the CV with nested relations
    const updatedCv = await this.databaseService.cv.update({
      where: { id },
      include: {
        experience: true,
        projects: true,
        educations: true,
        certificates: true,
        languages: true,
        socials: true,
        courses: true,
        skills: true,
        companyLogo: true,
      },
      data: {
        applicant: {
          update: {
            templateId,
            publicCv,
          },
        },
        companyLogo: companyLogoUpdate
          ? {
              connect: {
                id: companyLogoUpdate,
              },
            }
          : undefined,
        firstName: rest.firstName,
        lastName: rest.lastName,
        companyName: rest.companyName,
        primaryColor: rest.primaryColor,
        secondaryColor: rest.secondaryColor,
        tertiaryColor: rest.tertiaryColor,
        showCompanyInfo: rest.showCompanyInfo,
        showPersonalInfo: rest.showPersonalInfo,
        email: rest.email,
        phone: rest.phone,
        summary: rest.summary,
        hobbies: rest.hobbies,
        experience: rest.experience
          ? {
              upsert: rest.experience.map((exp) => ({
                where: { id: exp.id || defaultUUID }, // Assumes existing ID or empty string for new
                update: exp,
                create: {
                  position: exp.position,
                  company: exp.company,
                  startDate: exp.startDate,
                  endDate: exp.endDate,
                  description: exp.description,
                },
              })),
            }
          : undefined,
        projects: rest.projects
          ? {
              upsert: rest.projects.map((proj) => ({
                where: { id: proj.id || defaultUUID },
                update: proj,
                create: {
                  name: proj.name,
                  description: proj.description,
                  startDate: proj.startDate,
                  endDate: proj.endDate,
                  url: proj.url,
                },
              })),
            }
          : undefined,
        educations: rest.educations
          ? {
              upsert: rest.educations.map((edu) => ({
                where: { id: edu.id || defaultUUID },
                update: edu,
                create: {
                  field: edu.field,
                  degree: edu.degree,
                  startDate: edu.startDate,
                  endDate: edu.endDate,
                  institution: edu.institution,
                },
              })),
            }
          : undefined,
        certificates: rest.certificates
          ? {
              upsert: rest.certificates.map((cert) => ({
                where: { id: cert.id || defaultUUID },
                update: cert,
                create: {
                  name: cert.name,
                  expirationDate: cert.expirationDate,
                  issueDate: cert.issueDate,
                  issuer: cert.issuer,
                  url: cert.url,
                },
              })),
            }
          : undefined,
        courses: rest.courses
          ? {
              upsert: rest.courses.map((course) => ({
                where: { id: course.id || defaultUUID },
                update: course,
                create: {
                  name: course.name,
                  startDate: course.startDate,
                  endDate: course.endDate,
                  url: course.url,
                },
              })),
            }
          : undefined,
        socials: rest.socials
          ? {
              upsert: rest.socials.map((social) => ({
                where: { id: social.id || defaultUUID },
                update: social,
                create: {
                  name: social.name,
                  url: social.url,
                },
              })),
            }
          : undefined,
        languages: rest.languages
          ? {
              upsert: rest.languages.map((lang) => ({
                where: { id: lang.id || defaultUUID },
                update: lang,
                create: {
                  name: lang.name,
                  efficiency: lang.efficiency,
                },
              })),
            }
          : undefined,
        skills: rest.skills
          ? {
              upsert: rest.skills.map((skill) => ({
                where: {
                  id: skill.id || defaultUUID,
                },
                update: skill,
                create: {
                  name: skill.name,
                  efficiency: skill.efficiency,
                },
              })),
            }
          : undefined,
      },
    });

    // create new cv file
    const updatedCvWithLogo = { ...updatedCv, companyLogo: cv.companyLogo };
    const data = this.transformToICvData(updatedCvWithLogo);

    const pdfBuffer = await this.pdfService.generateCvPdfPuppeteer(
      data,
      templateId
    );

    let pdfFile: IUploadedFile | null = null;
    try {
      pdfFile = await this.spacesService.uploadFileBuffer(
        pdfBuffer,
        `${cv.applicant.firstName}_${cv.applicant.lastName}`,
        SpacesDestinationPath.PDF
      );
    } catch (error) {
      throw new BadRequestException("Something went wrong with file upload");
    }

    //delete old cv file if exists

    await this.spacesService.deleteFileByURL(cv.applicant.file.url);
    await this.databaseService.file.delete({
      where: {
        id: cv.applicant.file.id,
      },
    });

    await this.databaseService.file.create({
      data: {
        name: `${cv.applicant.firstName}_${cv.applicant.lastName}`,
        url: pdfFile.url,
        extension: pdfFile.extension,
        fileCreatedAt: pdfFile.createdAt,
        applicant: { connect: { id: cv.applicant.id } },
        user: { connect: { id: userId } },
      },
    });
    // should use applicant service
    // await this.databaseService.applicant.update({
    //   where: {
    //     id: cv.applicant.id,
    //   },
    //   data: {
    //     technologies: skills,
    //   },
    // });

    return updatedCv;
  }

  async getPublicCv(id: string) {
    const cv = await this.databaseService.cv.findUnique({
      where: {
        id,
        applicant: {
          publicCv: true,
        },
      },
      include: {
        experience: true,
        projects: true,
        educations: true,
        certificates: true,
        languages: true,
        socials: true,
        courses: true,
        skills: true,
        companyLogo: true,
      },
    });

    if (!cv) {
      throw new NotFoundException("CV not found");
    }
    return cv;
  }

  async getCv(id: string, userId: string) {
    const cv = await this.databaseService.cv.findUnique({
      where: {
        id,
        applicant: {
          userId,
        },
      },
      include: {
        experience: true,
        projects: true,
        educations: true,
        certificates: true,
        languages: true,
        socials: true,
        courses: true,
        skills: true,
        companyLogo: true,
      },
    });

    if (!cv) {
      throw new NotFoundException("CV not found");
    }
    return cv;
  }

  async deleteFields(deleteFields: DeleteCvFieldsByIdDto, cvId: string) {
    if (deleteFields.expirience) {
      await this.databaseService.experience.deleteMany({
        where: {
          id: { in: deleteFields.expirience },
          cvId: cvId, // Ensure the experience belongs to this CV
        },
      });
    }

    if (deleteFields.education) {
      await this.databaseService.education.deleteMany({
        where: {
          id: { in: deleteFields.education },
          cvId: cvId,
        },
      });
    }

    if (deleteFields.projects) {
      await this.databaseService.project.deleteMany({
        where: {
          id: { in: deleteFields.projects },
          cvId: cvId,
        },
      });
    }

    if (deleteFields.courses) {
      await this.databaseService.course.deleteMany({
        where: {
          id: { in: deleteFields.courses },
          cvId: cvId,
        },
      });
    }

    if (deleteFields.certificates) {
      await this.databaseService.certificate.deleteMany({
        where: {
          id: { in: deleteFields.certificates },
          cvId: cvId,
        },
      });
    }

    if (deleteFields.languages) {
      await this.databaseService.cvLanguage.deleteMany({
        where: {
          id: { in: deleteFields.languages },
          cvId: cvId,
        },
      });
    }

    if (deleteFields.socials) {
      await this.databaseService.social.deleteMany({
        where: {
          id: { in: deleteFields.socials },
          cvId: cvId,
        },
      });
    }

    if (deleteFields.skills) {
      await this.databaseService.skills.deleteMany({
        where: {
          id: { in: deleteFields.skills },
          cvId: cvId,
        },
      });
    }
  }

  transformToICvData(cv: CvResponseDto): ICvDataExtended {
    return {
      firstName: cv.firstName,
      lastName: cv.lastName,
      email: cv.email,
      phone: cv.phone,
      summary: cv.summary,
      companyName: cv.companyName,
      companyLogoUrl: cv.companyLogo.url,
      primaryColor: cv.primaryColor,
      secondaryColor: cv.secondaryColor,
      tertiaryColor: cv.tertiaryColor,
      showCompanyInfo: cv.showCompanyInfo,
      showPersonalInfo: cv.showPersonalInfo,

      hobies: cv.hobbies || [], // Using "hobies" to match your interface; consider fixing to "hobbies"

      skills: cv.skills
        ? cv.skills.map((skill) => ({
            name: skill.name,
            efficiency: skill.efficiency,
          }))
        : [],
      experience: cv.experience
        ? cv.experience.map((exp) => ({
            position: exp.position,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate || undefined,
            description: exp.description,
          }))
        : [],

      projects: cv.projects
        ? cv.projects.map((proj) => ({
            name: proj.name,
            description: proj.description,
            startDate: proj.startDate,
            endDate: proj.endDate || undefined,
            url: proj.url,
          }))
        : [],

      educations: cv.educations.map((edu) => ({
        institution: edu.institution,
        degree: edu.degree || "",
        field: edu.field || "",
        startDate: edu.startDate,
        endDate: edu.endDate || undefined, // Convert null to undefined
        grade: undefined, // Not provided in input
      })),

      certificates: cv.certificates
        ? cv.certificates.map((cert) => ({
            name: cert.name,
            issuer: cert.issuer,
            issueDate: cert.issueDate,
            expirationDate: cert.expirationDate || undefined,
            url: cert.url,
          }))
        : [],

      languages: cv.languages
        ? cv.languages.map((lang) => ({
            name: lang.name,
            efficiency: lang.efficiency,
          }))
        : [],

      socials: cv.socials.map((social) => ({
        name: social.name,
        url: social.url,
      })),

      courses: cv.courses
        ? cv.courses.map((course) => ({
            name: course.name,
            url: course.url,
            startDate: course.startDate,
            endDate: course.endDate || undefined,
          }))
        : [],
    };
  }
}
