import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { JobType } from "@prisma/client";
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
} from "class-validator";

export class CreateJobDto {
  @ApiProperty({
    example: false,
    description: "Whether the job is available worldwide or not",
  })
  @IsBoolean()
  worldwide: boolean;

  @ApiProperty({
    example: false,
    description: "Whether the job is remote or not",
  })
  @IsBoolean()
  remote: boolean;

  @ApiProperty({
    example: "SE",
    description: "The code of the job",
  })
  @IsString()
  @MaxLength(10)
  code: string;

  @ApiProperty({
    example: "Software Engineer",
    description: "The name of the job",
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: "This is a job for software engineer",
    description: "The description of the job",
  })
  @IsString()
  @MaxLength(255)
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
    example: "12345678-1234-1234-1234-123456789012",
    description: "The identifier of the job position",
  })
  @IsUUID()
  @IsNotEmpty()
  jobPosition: string;

  @ApiProperty({
    example: "12345678-1234-1234-1234-123456789012",
    description: "The identifier of the organization",
  })
  @IsUUID()
  @IsNotEmpty()
  organization: string;
}
