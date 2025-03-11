import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "@prisma/client";
import { Expose, Type } from "class-transformer";
import { UserResponseDto } from "./user-response.dto";
import { FileResponseDto } from "src/modules/file/dtos/file.response.dto";

export class UserProfileResponseDto implements Profile {
  @ApiProperty({
    type: String,
    description: "User ID",
    example: "ecc5f54d-9ca0-4c45-8ba5-ea58d8b1c440",
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    description: "Phone number",
    example: "1234567890",
  })
  @Expose()
  phoneNumber: string | null;

  @ApiProperty({
    type: String,
    description: "Address",
    example: "123 Main Street",
  })
  @Expose()
  address: string | null;

  @ApiProperty({
    type: String,
    description: "User ID",
    example: "ecc5f54d-9ca0-4c45-8ba5-ea58d8b1c440",
  })
  userId: string;

  @ApiProperty({
    type: UserResponseDto,
    example: UserResponseDto,
    description: "User",
  })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({
    type: [FileResponseDto],
    example: [FileResponseDto],
    description: "Company logos",
  })
  @Expose()
  @Type(() => FileResponseDto)
  companyLogos: FileResponseDto[];
}
