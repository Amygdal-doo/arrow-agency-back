import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ApplicationType,
  JobExperienceLevel,
  JobStatus,
  JobType,
} from "@prisma/client";
import {
  IsBoolean,
  IsString,
  MaxLength,
  IsDate,
  IsNumber,
  IsOptional,
  IsEnum,
  IsUUID,
  IsArray,
  IsNotEmpty,
  IsDateString,
  MinLength,
} from "class-validator";

export class CreateJobDto {
  @ApiProperty({
    example: false,
    description: "Whether the job is available worldwide or not",
  })
  @IsBoolean()
  @IsNotEmpty()
  worldwide: boolean;

  @ApiProperty({
    example: false,
    description: "Whether the job is available for B2B or not",
  })
  @IsBoolean()
  @IsNotEmpty()
  workWithB2b: boolean;

  @ApiProperty({
    example: false,
    description: "Whether the job is remote or not",
  })
  @IsBoolean()
  @IsNotEmpty()
  remote: boolean;

  @ApiProperty({
    example: "Software Engineer",
    description: "The name of the job",
  })
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: "This is a job for software engineer",
    description: "The description of the job",
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  description?: string | null;

  @ApiPropertyOptional({
    example: "100000",
    description: "The salary of the job",
  })
  @IsString()
  @MaxLength(20)
  salary?: string | null;

  @ApiProperty({
    example: "2022-01-01T00:00:00.000Z",
    description:
      "The date before which the job application should be submitted",
  })
  @IsDateString()
  @IsNotEmpty()
  //   @IsDate()
  applyBeforeDate: string;

  @ApiPropertyOptional({
    example: 1,
    description: "The number of vacancies for the job",
  })
  @IsNumber()
  @IsOptional()
  noOfVacancies?: number | null;

  @ApiProperty({
    enum: JobType,
    example: JobType.FULL_TIME,
    description: "The type of the job",
  })
  @IsNotEmpty()
  @IsEnum(JobType)
  jobType: JobType;

  @ApiProperty({
    example: ["12345678-1234-1234-1234-123456789012"],
    description: "The identifiers of the job skills",
  })
  @IsUUID("4", { each: true })
  @IsArray()
  jobSkills: string[];

  @ApiProperty({
    example: "12345678-1234-1234-1234-123456789012",
    description: "The identifier of the job category",
  })
  @IsUUID()
  @IsNotEmpty()
  jobCategory: string;

  @ApiProperty({
    example: "www.example.com",
    description: "The link or email address for applying to the job",
  })
  @IsNotEmpty()
  @IsString()
  applicationLinkOrEmail: string;

  @ApiProperty({
    enum: ApplicationType,
    example: ApplicationType.LINK,
    description: "The type of application link or email",
  })
  @IsNotEmpty()
  @IsEnum(ApplicationType)
  typeOfApplication: ApplicationType;

  @ApiPropertyOptional({
    enum: JobExperienceLevel,
    example: JobExperienceLevel.JUNIOR,
    description: "The level of experience required for the job",
  })
  @IsEnum(JobExperienceLevel)
  @IsOptional()
  experienceRequired?: JobExperienceLevel;

  @ApiProperty({
    example: "12345678-1234-1234-1234-123456789012",
    description: "The identifier of the organization",
  })
  @IsUUID()
  @IsNotEmpty()
  organization: string;
}
