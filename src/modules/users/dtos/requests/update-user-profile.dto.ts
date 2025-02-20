import { ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateUserProfileDto implements Prisma.ProfileUpdateInput {
  @ApiPropertyOptional({
    type: String,
    description: "Phone number",
    example: "1234567890",
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string | null;

  @ApiPropertyOptional({
    example: "123 Main Street",
    description: "The address of the customer",
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  address?: string;
}
