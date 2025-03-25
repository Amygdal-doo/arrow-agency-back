import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Job, JobType } from "@prisma/client";
import { Expose, Type } from "class-transformer";
import { PaginationResponseDto } from "src/common/dtos/pagination.dto";
import { OrganizationResponse } from "src/modules/organization/dtos/responses/organization.response";
import { JobCategoryResponseDto } from "./job_category.response.dto";
import { JobPositionResponseDto } from "./job_position.response.dto";
import { JobSkillsResponseDto } from "src/modules/skill/dtos/responses/job_skill.response.dto";

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
    example: "SE",
    description: "The code of the job",
  })
  @Expose()
  code: string;

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
    description: "The identifier of the job position",
  })
  @Expose()
  jobPositionId: string;

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
    example: JobPositionResponseDto,
    description: "The Position of the job",
  })
  @Expose()
  @Type(() => JobPositionResponseDto)
  jobPosition: JobPositionResponseDto;

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
