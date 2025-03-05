import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserAndProfileDto {
  @ApiPropertyOptional({
    type: String,
    description: "Phone number",
    example: "1234567890",
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string | null;

  @ApiPropertyOptional({
    example: "ulica 23",
    description: "The name of the customer",
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    example: "John",
    description: "Your first name",
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    example: "Doe",
    description: "Your last name",
  })
  @IsString()
  @IsOptional()
  lastName?: string;
}
