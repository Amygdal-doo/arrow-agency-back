import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UpdateCertificateDto } from "./update_certificate.body.dto";
import { UpdateCourseDto } from "./update_course.body.dto";
import { UpdateEducationDto } from "./update_education.body.dto";
import { UpdateExperienceDto } from "./update_experience.body.dto";
import { UpdateCvLanguageDto } from "./update_language.body.dto";
import { UpdateProjectDto } from "./update_project.body.dto";
import { UpdateSocialDto } from "./update_social.body.dto";
import { DeleteCvFieldsByIdDto } from "../delete_cv_fields_by_id.dto";
import { Skills } from "@prisma/client";
import { UpdateSkillsDto } from "./update_skills.body.dto";

export class UpdateCvDto {
  @ApiPropertyOptional({
    example: "John",
    description: "First name of the person",
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    example: "Doe",
    description: "Last name of the person",
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    example: "Amygdal doo",
    description: "Full name of the Firm",
  })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiPropertyOptional({
    example: false,
    description: "Show company info or not",
  })
  @IsBoolean()
  @IsOptional()
  showCompanyInfo?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: "Show personal info or not",
  })
  @IsBoolean()
  @IsOptional()
  showPersonalInfo?: boolean;

  @ApiPropertyOptional({
    example: "#007bff",
    description: "Color palette for the cv",
  })
  @IsString()
  @IsOptional()
  colorPalette?: string;

  @ApiPropertyOptional({
    example: "john.doe@example.com",
    description: "Email address of the person",
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: "123-456-7890",
    description: "Phone number of the person",
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: "Software engineer with 5 years of experience",
    description: "Summary of the person",
  })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiPropertyOptional({
    type: [UpdateSkillsDto],
    description: "Skills of the person",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSkillsDto)
  @IsOptional()
  skills?: UpdateSkillsDto[];

  @ApiPropertyOptional({
    example: ["Reading", "Cycling"],
    description: "Hobbies of the person",
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hobbies?: string[];

  @ApiPropertyOptional({
    type: [UpdateExperienceDto],
    description: "Experience entries of the person",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateExperienceDto)
  @IsOptional()
  experience?: UpdateExperienceDto[];

  @ApiPropertyOptional({
    type: [UpdateProjectDto],
    description: "Projects associated with the person",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProjectDto)
  @IsOptional()
  projects?: UpdateProjectDto[];

  @ApiPropertyOptional({
    type: [UpdateEducationDto],
    description: "Education entries of the person",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEducationDto)
  @IsOptional()
  educations?: UpdateEducationDto[];

  @ApiPropertyOptional({
    type: [UpdateCertificateDto],
    description: "Certifications held by the person",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCertificateDto)
  @IsOptional()
  certificates?: UpdateCertificateDto[];

  @ApiPropertyOptional({
    type: [UpdateCourseDto],
    description: "Courses the person has completed",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCourseDto)
  @IsOptional()
  courses?: UpdateCourseDto[];

  @ApiPropertyOptional({
    type: [UpdateSocialDto],
    description: "Social media profiles of the person",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSocialDto)
  @IsOptional()
  socials?: UpdateSocialDto[];

  @ApiPropertyOptional({
    type: [UpdateCvLanguageDto],
    description: "Languages known by the person",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCvLanguageDto)
  @IsOptional()
  languages?: UpdateCvLanguageDto[];

  @ApiProperty({
    type: DeleteCvFieldsByIdDto,
    description: "Fields to be deleted from the CV",
  })
  @ValidateNested()
  @Type(() => DeleteCvFieldsByIdDto)
  @IsNotEmpty()
  delete?: DeleteCvFieldsByIdDto;
}
