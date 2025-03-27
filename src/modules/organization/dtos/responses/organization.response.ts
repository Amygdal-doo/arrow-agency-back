import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { $Enums, CreatedBy, JobStatus, Organization } from "@prisma/client";
import { Expose, Type } from "class-transformer";
import { PaginationResponseDto } from "src/common/dtos/pagination.dto";
import { FileResponseDto } from "src/modules/file/dtos/file.response.dto";
import { UserResponseDto } from "src/modules/users/dtos/response/user-response.dto";

export class OrganizationResponse implements Organization {
  @Expose()
  @ApiProperty({
    example: "ad56b0f8-a6a5-4b9e-9f5f-5b1a4b5b6c7d",
    description: "The id of the organization",
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: "admin@acme.com",
    description: "The email of the organization",
  })
  email: string;

  @Expose()
  @ApiProperty({
    example: "ACME INC",
    description: "The name of the organization",
  })
  name: string;

  @Expose()
  @ApiProperty({
    example: "About ACME INC",
    description: "The about of the organization",
  })
  about: string;

  @ApiProperty({
    enum: JobStatus,
    description: "The status of the organization",
    example: JobStatus.DRAFT,
  })
  @Expose()
  status: JobStatus;

  @Expose()
  @ApiProperty({
    example: true,
    description: "The verified of the organization",
  })
  verified: boolean;

  @Expose()
  @ApiPropertyOptional({
    example: "Culture about ACME INC",
    description: "The culture of the organization",
  })
  culture: string | null;

  @Expose()
  @ApiPropertyOptional({
    example: "Benefits of working at ACME INC",
    description: "The benefits of the organization",
  })
  benefits: string | null;

  @Expose()
  @ApiProperty({
    example: "New York, USA",
    description: "The location of the organization",
  })
  location: string;

  @ApiProperty({
    type: String,
    description: "Organization logo image",
    example: FileResponseDto,
  })
  @Expose()
  @Type(() => FileResponseDto)
  logo?: FileResponseDto;

  //   jobs: string[];

  @Expose()
  @ApiProperty({
    example: CreatedBy.LOGGED_USER,
    description: "The created by of the organization",
  })
  createdBy: CreatedBy;

  @Expose()
  @ApiProperty({
    example: "12345678-1234-1234-1234-123456789012",
    description: "The user identifier who created the organization",
  })
  userId: string;

  @Expose()
  @ApiPropertyOptional({
    type: UserResponseDto,
    description: "The user who created the organization",
  })
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @Expose()
  @ApiProperty({
    example: "2022-01-01T00:00:00.000Z",
    description: "The created at of the organization",
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: "2022-01-01T00:00:00.000Z",
    description: "The updated at of the organization",
  })
  updatedAt: Date;
}

export class OrganizationPaginationResponseDto extends PaginationResponseDto {
  @Expose()
  @Type(() => OrganizationResponse)
  results: OrganizationResponse[];
}
