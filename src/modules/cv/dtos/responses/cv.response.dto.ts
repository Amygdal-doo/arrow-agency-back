import { ApiProperty } from "@nestjs/swagger";
import { Cv } from "@prisma/client";
import { Expose, Type } from "class-transformer";
import { CvCertificateResponseDto } from "./cv_certificate.response.dto";
import { CvCourseResponseDto } from "./cv_course.response.dto";
import { CvEducationResponseDto } from "./cv_education.response.dto";
import { CvLanguageResponseDto } from "./cv_language.response.dto";
import { CvProjectResponseDto } from "./cv_project.response.dto";
import { CvSocialResponseDto } from "./cv_social.response.dto";
import { CvExperienceResponseDto } from "./cv_experience.response.dto";
import { CvSkillResponseDto } from "./cv_skills.response";
import { FileResponseDto } from "src/modules/file/dtos/file.response.dto";
import { ApplicantResponseDto } from "src/modules/applicant/dtos/applicant.response.dto";

export class CvResponseDto implements Cv {
  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the CV",
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: () => ApplicantResponseDto,
    example: ApplicantResponseDto,
    description: "Cv owner",
  })
  @Type(() => ApplicantResponseDto)
  @Expose()
  applicant?: ApplicantResponseDto;

  @ApiProperty({
    example: "John",
    description: "First name of the person",
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    example: "Doe",
    description: "Last name of the person",
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    example: "Amygdal D.o.o.",
    description: "Name of the company",
  })
  @Expose()
  companyName: string;

  @ApiProperty({
    example: false,
    description: "Show company info or not",
  })
  @Expose()
  showCompanyInfo: boolean;

  @ApiProperty({
    example: false,
    description: "Show personal info or not",
  })
  @Expose()
  showPersonalInfo: boolean;

  @ApiProperty({
    example: "#007bff",
    description: "Color palette for the cv",
  })
  @Expose()
  primaryColor: string;

  @ApiProperty({
    example: "#007bff",
    description: "Color palette for the cv",
  })
  @Expose()
  secondaryColor: string;

  @ApiProperty({
    example: "#007bff",
    description: "Color palette for the cv",
  })
  @Expose()
  tertiaryColor: string;

  @ApiProperty({
    type: String,
    description: "Cv file of the applicant",
    example: FileResponseDto,
  })
  @Expose()
  @Type(() => FileResponseDto)
  companyLogo: FileResponseDto;

  @ApiProperty({
    example: "john.doe@example.com",
    description: "Email address of the person",
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: "123-456-7890",
    description: "Phone number of the person",
  })
  @Expose()
  phone: string;

  @ApiProperty({
    example: "Software engineer with 5 years of experience",
    description: "Summary of the person",
  })
  @Expose()
  summary: string;

  @ApiProperty({
    example: ["JavaScript", "TypeScript", "Node.js"],
    description: "Skills of the person",
  })
  @Expose()
  skills: CvSkillResponseDto[];

  @ApiProperty({
    example: ["Reading", "Cycling"],
    description: "Hobbies of the person",
  })
  @Expose()
  hobbies: string[];

  @ApiProperty({
    example: [CvCertificateResponseDto],
    description: "Certificates of the person",
  })
  @Expose()
  @Type(() => CvCertificateResponseDto)
  certificates: CvCertificateResponseDto[];

  @ApiProperty({
    example: [CvCourseResponseDto],
    description: "Courses of the person",
  })
  @Expose()
  @Type(() => CvCourseResponseDto)
  courses: CvCourseResponseDto[];

  @ApiProperty({
    example: [CvEducationResponseDto],
    description: "Educations of the person",
  })
  @Expose()
  @Type(() => CvEducationResponseDto)
  educations: CvEducationResponseDto[];

  @ApiProperty({
    example: [CvLanguageResponseDto],
    description: "Languages of the person",
  })
  @Expose()
  @Type(() => CvLanguageResponseDto)
  languages: CvLanguageResponseDto[];

  @ApiProperty({
    example: [CvProjectResponseDto],
    description: "Projects of the person",
  })
  @Expose()
  @Type(() => CvProjectResponseDto)
  projects: CvProjectResponseDto[];

  @ApiProperty({
    example: [CvSocialResponseDto],
    description: "Socials of the person",
  })
  @Expose()
  @Type(() => CvSocialResponseDto)
  socials: CvSocialResponseDto[];

  @ApiProperty({
    example: [CvExperienceResponseDto],
    description: "Experiences of the person",
  })
  @Expose()
  @Type(() => CvExperienceResponseDto)
  experience: CvExperienceResponseDto[];

  @ApiProperty({
    example: "2022-01-01T00:00:00.000Z",
    description: "Date when the CV was created",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2022-01-01T00:00:00.000Z",
    description: "Date when the CV was last updated",
  })
  @Expose()
  updatedAt: Date;
}
