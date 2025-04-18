import { ApiProperty } from "@nestjs/swagger";
import { Role, User } from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";
import { ApplicantResponseDto } from "src/modules/applicant/dtos/applicant.response.dto";
import { FileResponseDto } from "src/modules/file/dtos/file.response.dto";

export class UserResponseDto implements User {
  @ApiProperty({
    type: String,
    description: "User ID",
    example: "ecc5f54d-9ca0-4c45-8ba5-ea58d8b1c440",
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    description: "User email address",
    example: "example@domain.com",
  })
  @Expose()
  email: string;

  @ApiProperty({
    type: String,
    description: "First name of the user",
    example: "John",
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    type: String,
    description: "Last name of the user",
    example: "Doe",
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    enum: Role,
    description: "Role of the user",
    example: Role.USER,
  })
  @Expose()
  role: Role;

  @ApiProperty({
    type: [ApplicantResponseDto],
    description: "List of applicant with the user",
    example: [ApplicantResponseDto],
  })
  @Expose()
  @Type(() => ApplicantResponseDto)
  applicants: ApplicantResponseDto[];

  @ApiProperty({
    type: [FileResponseDto],
    description: "List of files associated with the user",
    example: [FileResponseDto],
  })
  files: FileResponseDto[];

  @ApiProperty({
    type: Date,
    description: "Creation date of the user record",
    example: "2023-01-01T00:00:00Z",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: "Last update date of the user record",
    example: "2023-01-02T00:00:00Z",
  })
  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  pan_tokens: string[];

  @Exclude()
  customerId: string;
}
