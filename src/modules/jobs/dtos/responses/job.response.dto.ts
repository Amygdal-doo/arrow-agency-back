import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ApplicationType,
  CreatedBy,
  Job,
  JobExperienceLevel,
  JobStatus,
  JobType,
} from "@prisma/client";
import { Expose, Type } from "class-transformer";
import { PaginationResponseDto } from "src/common/dtos/pagination.dto";
import { OrganizationResponse } from "src/modules/organization/dtos/responses/organization.response";
import { JobCategoryResponseDto } from "./job_category.response.dto";
import { UserResponseDto } from "src/modules/users/dtos/response/user-response.dto";

export class JobResponseDto implements Job {
  @ApiProperty({
    example: "12345678-1234-1234-1234-123456789012",
    description: "The identifier of the job",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: false,
    description: "Whether the job is available worldwide or not",
  })
  @Expose()
  worldwide: boolean;

  @ApiProperty({
    example: false,
    description: "Whether the job is remote or not",
  })
  @Expose()
  remote: boolean;

  @ApiProperty({
    example: "Software Engineer",
    description: "The name of the job",
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    example: "This is a job for software engineer",
    description: "The description of the job",
    required: false,
  })
  @Expose()
  description: string | null;

  @ApiPropertyOptional({
    example: "100000",
    description: "The salary of the job",
    required: false,
  })
  @Expose()
  salary: string | null;

  @ApiProperty({
    example: "2022-01-01T00:00:00.000Z",
    description:
      "The date before which the job application should be submitted",
  })
  @Expose()
  applyBeforeDate: Date;

  @ApiPropertyOptional({
    example: 1,
    description: "The number of vacancies for the job",
    required: false,
  })
  @Expose()
  noOfVacancies: number | null;

  @ApiProperty({
    example: "12345678-1234-1234-1234-123456789012",
    description: "The identifier of the job category",
  })
  @Expose()
  jobCategoryId: string;

  @ApiProperty({
    example: "12345678-1234-1234-1234-123456789012",
    description: "The identifier of the organization",
  })
  @Expose()
  organizationId: string;

  @ApiProperty({
    example: "FULL_TIME",
    description: "The type of the job",
  })
  @Expose()
  jobType: JobType;

  @ApiProperty({
    example: OrganizationResponse,
    description: "The organization of the job",
  })
  @Expose()
  @Type(() => OrganizationResponse)
  organization: OrganizationResponse;

  @ApiProperty({
    example: JobCategoryResponseDto,
    description: "The Category of the job",
  })
  @Expose()
  @Type(() => JobCategoryResponseDto)
  jobCategory: JobCategoryResponseDto;

  @ApiProperty({
    enum: JobStatus,
    example: JobStatus.PUBLISHED,
    description: "The current status of the job",
  })
  @Expose()
  status: JobStatus;

  @ApiProperty({
    enum: ApplicationType,
    example: ApplicationType.EMAIL,
    description: "The type of application for the job",
  })
  @Expose()
  typeOfApplication: ApplicationType;

  @ApiProperty({
    example: "https://example.com/apply",
    description: "The link where the applicants can apply for the job",
  })
  @Expose()
  applicationLinkOrEmail: string;

  @ApiProperty({
    enum: JobExperienceLevel,
    example: JobExperienceLevel.SENIOR,
    description: "The experience level required for the job",
  })
  @Expose()
  experienceRequired: JobExperienceLevel;

  @ApiProperty({
    enum: CreatedBy,
    example: CreatedBy.NOT_LOGGED,
    description: "The kind of user who created the job",
  })
  @Expose()
  createdBy: CreatedBy;

  @ApiPropertyOptional({
    example: "12345678-1234-1234-1234-123456789012",
    description: "The ID of the user who created the job",
  })
  @Expose()
  userId: string | null;

  @ApiPropertyOptional({
    example: UserResponseDto,
    description: "The user who created the job",
  })
  @Type(() => UserResponseDto)
  @Expose()
  user?: UserResponseDto;

  //   @ApiProperty({
  //     example: [JobSkillsResponseDto],
  //     description: "The Position of the job",
  //   })
  //   @Expose()
  //   @Type(() => JobSkillsResponseDto)
  //   jobSkills: JobSkillsResponseDto[];

  @ApiProperty({
    example: "2022-01-01T00:00:00.000Z",
    description: "The creation date of the job",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2022-01-01T00:00:00.000Z",
    description: "The update date of the job",
  })
  @Expose()
  updatedAt: Date;
}

export class JobPaginationResponseDto extends PaginationResponseDto {
  @Expose()
  @Type(() => JobResponseDto)
  results: JobResponseDto[];
}
