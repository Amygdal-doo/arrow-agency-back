import { ApiProperty } from "@nestjs/swagger";
import { Applicant } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { Expose, Type } from "class-transformer";
import { FileResponseDto } from "src/modules/file/dtos/file.response.dto";
import { UserResponseDto } from "src/modules/users/dtos/response/user-response.dto";

export class ApplicantResponseDto implements Applicant {
  @ApiProperty({
    type: String,
    description: "Applicant ID",
    example: "ecc5f54d-9ca0-4c45-8ba5-ea58d8b1c440",
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    description: "First name of the applicant",
    example: "John",
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    type: String,
    description: "Last name of the applicant",
    example: "Doe",
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    type: String,
    description: "Email address of the applicant",
    example: "example@domain.com",
  })
  @Expose()
  email: string;

  @ApiProperty({
    type: String,
    description: "Phone number of the applicant",
    example: "+420 123 456 789",
    nullable: true,
  })
  @Expose()
  phone: string | null;

  @ApiProperty({
    type: [String],
    description: "Technologies of the applicant",
    example: ["node", "typescript", "javascript"],
  })
  @Expose()
  technologies: string[];

  @ApiProperty({
    type: String,
    description: "CV data of the applicant in JSON format",
    example: '{"name": "John", "age": 30}',
  })
  @Expose()
  cvData: JsonValue;

  @ApiProperty({
    type: String,
    description: "User ID of the applicant",
    example: "ecc5f54d-9ca0-4c45-8ba5-ea58d8b1c440",
  })
  @Expose()
  userId: string;

  @ApiProperty({
    type: String,
    description: "Cv file of the applicant",
    example: FileResponseDto,
  })
  @Expose()
  @Type(() => FileResponseDto)
  file?: FileResponseDto;

  @ApiProperty({
    type: UserResponseDto,
    description: "User of the applicant",
    example: UserResponseDto,
  })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({
    type: Date,
    description: "Creation date of the applicant record",
    example: "2023-01-01T00:00:00Z",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: "Last update date of the applicant record",
    example: "2023-01-02T00:00:00Z",
  })
  @Expose()
  updatedAt: Date;
}
