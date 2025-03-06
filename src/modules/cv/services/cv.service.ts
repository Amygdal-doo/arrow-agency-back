import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { UpdateCvDto } from "../dtos/requests/update/update_cv.body.dto";
import { NotFound } from "@aws-sdk/client-s3";
import { DeleteCvFieldsByIdDto } from "../dtos/requests/delete_cv_fields_by_id.dto";
import { ICvData } from "src/modules/pdf/interfaces/cv-data.interface";
import { CvResponseDto } from "../dtos/responses/cv.response.dto";
import { IUploadedFile } from "src/modules/spaces/interfaces/iuploaded-file.interface";
import { SpacesService } from "src/modules/spaces/spaces.service";
import { PdfService } from "src/modules/pdf/pdf.service";
import { SpacesDestinationPath } from "src/modules/spaces/enums/spaces-folder-name.enum";

@Injectable()
export class CvService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly spacesService: SpacesService,
    private readonly pdfService: PdfService
  ) {}

  async updateCv(userId: string, id: string, updateCvDto: UpdateCvDto) {
    // Fetch the CV with its Applicant and User
    const cv = await this.databaseService.cv.findUnique({
      where: { id },
      include: { applicant: { include: { user: true, file: true } } },
    });

    if (!cv) {
      throw new ForbiddenException("CV not found");
    }

    if (cv.applicant?.userId !== userId) {
      throw new ForbiddenException("You are not authorized to update this CV");
    }

    // Delete fields
    await this.deleteFields(updateCvDto.delete, id);

    // const skills = updateCvDto.skills.map((skill) => skill.toUpperCase());

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
      },
      data: {
        firstName: updateCvDto.firstName,
        lastName: updateCvDto.lastName,
        email: updateCvDto.email,
        phone: updateCvDto.phone,
        summary: updateCvDto.summary,
        hobbies: updateCvDto.hobbies,
        experience: updateCvDto.experience
          ? {
              upsert: updateCvDto.experience.map((exp) => ({
                where: { id: exp.id || "" }, // Assumes existing ID or empty string for new
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
        projects: updateCvDto.projects
          ? {
              upsert: updateCvDto.projects.map((proj) => ({
                where: { id: proj.id || "" },
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
        educations: updateCvDto.educations
          ? {
              upsert: updateCvDto.educations.map((edu) => ({
                where: { id: edu.id || "" },
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
        certificates: updateCvDto.certificates
          ? {
              upsert: updateCvDto.certificates.map((cert) => ({
                where: { id: cert.id || "" },
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
        courses: updateCvDto.courses
          ? {
              upsert: updateCvDto.courses.map((course) => ({
                where: { id: course.id || "" },
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
        socials: updateCvDto.socials
          ? {
              upsert: updateCvDto.socials.map((social) => ({
                where: { id: social.id || "" },
                update: social,
                create: {
                  name: social.name,
                  url: social.url,
                },
              })),
            }
          : undefined,
        languages: updateCvDto.languages
          ? {
              upsert: updateCvDto.languages.map((lang) => ({
                where: { id: lang.id || "" },
                update: lang,
                create: {
                  name: lang.name,
                  efficiency: lang.efficiency,
                },
              })),
            }
          : undefined,
        skills: updateCvDto.skills
          ? {
              upsert: updateCvDto.skills.map((skill) => ({
                where: { id: skill.id || "" },
                update: skill,
                create: {
                  name: skill.name.toUpperCase(),
                  efficiency: skill.efficiency,
                },
              })),
            }
          : undefined,
      },
    });

    // create new cv file
    const data = this.transformToICvData(updatedCv);

    const pdfBuffer = await this.pdfService.generateCvTemplate(data);

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
    if (cv.applicant.file.length > 0) {
      await this.spacesService.deleteFileByURL(cv.applicant.file[0].url);
      await this.databaseService.file.delete({
        where: {
          id: cv.applicant.file[0].id,
        },
      });
    }

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

  transformToICvData(cv: CvResponseDto): ICvData {
    return {
      firstName: cv.firstName,
      lastName: cv.lastName,
      email: cv.email,
      phone: cv.phone,
      summary: cv.summary,

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
