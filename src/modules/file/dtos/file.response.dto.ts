import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { File } from "@prisma/client";
import { Expose, Type } from "class-transformer";
import { ApplicantResponseDto } from "src/modules/applicant/dtos/applicant.response.dto";

export class FileResponseDto implements File {
  @ApiProperty({
    description: "Unique identifier of the file",
    example: "1edc68e7-2a7c-4f7f-8f1b-5c21b9d9f5a6",
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: "Name of the file",
    example: "CV.pdf",
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: "URL of the file",
    example: "https://example.com/CV.pdf",
  })
  @Expose()
  url: string;

  @ApiProperty({
    description: "File extension",
    example: "PDF",
  })
  @Expose()
  extension: string;

  @ApiProperty({
    description: "Date when the file was uploaded",
    example: "2022-01-01T00:00:00.000Z",
  })
  @Expose()
  fileCreatedAt: Date;

  @ApiProperty({
    description: "ID of the user who uploaded the file",
    example: "1edc68e7-2a7c-4f7f-8f1b-5c21b9d9f5a6",
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: "ID of the organization the uploaded image belongs to",
    example: "1edc68e7-2a7c-4f7f-8f1b-5c21b9d9f5a6",
  })
  @Expose()
  organizationId: string;

  @ApiProperty({
    description: "ID of the job the uploaded image belongs to",
    example: "1edc68e7-2a7c-4f7f-8f1b-5c21b9d9f5a6",
  })
  @Expose()
  jobId: string;

  @ApiPropertyOptional({
    description: "ID of the applicant who uploaded the file",
    example: "1edc68e7-2a7c-4f7f-8f1b-5c21b9d9f5a6",
  })
  @Expose()
  applicantId: string;

  @ApiPropertyOptional({
    description: "ID of the cv the uploaded image belongs to",
    example: "1edc68e7-2a7c-4f7f-8f1b-5c21b9d9f5a6",
  })
  @Expose()
  cvId: string;

  @ApiPropertyOptional({
    description: "Image height",
    example: 400,
  })
  @Expose()
  height: number;

  @ApiPropertyOptional({
    description: "Image width",
    example: 400,
  })
  @Expose()
  width: number;

  @ApiPropertyOptional({
    description: "ID of the profile the image belongs to",
    example: "1edc68e7-2a7c-4f7f-8f1b-5c21b9d9f5a6",
  })
  @Expose()
  profileId: string;

  // creates an error
  //   @ApiProperty({
  //     description: "User who uploaded the file",
  //     example: ApplicantResponseDto,
  //   })
  //   @Expose()
  //   //   @Type(() => ApplicantResponseDto)
  //   applicant?: ApplicantResponseDto;

  @ApiProperty({
    description: "Date when the file was created",
    example: "2022-01-01T00:00:00.000Z",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: "Date when the file was last updated",
    example: "2022-01-01T00:00:00.000Z",
  })
  @Expose()
  updatedAt: Date;
}
