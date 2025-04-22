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

  @ApiPropertyOptional({
    type: String,
    description: "Country of origin",
    example: "Spain",
  })
  @IsString()
  @IsOptional()
  countryOrigin?: string | null;

  @ApiPropertyOptional({
    type: [String],
    description: "Preferred countries to work",
    example: ["Spain", "Germany"],
  })
  @IsString({ each: true })
  @IsOptional()
  preferredWorkCountries?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: "Countries you don't want to work",
    example: ["France", "Italy"],
  })
  @IsString({ each: true })
  @IsOptional()
  nonPreferredWorkCountries?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: "Projects you don't want to work",
    example: ["project1", "project2"],
  })
  @IsString({ each: true })
  @IsOptional()
  nonPreferredProjects?: string[];
}
