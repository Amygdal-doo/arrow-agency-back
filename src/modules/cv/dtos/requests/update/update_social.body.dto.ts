import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID, IsOptional, IsString } from "class-validator";

export class UpdateSocialDto {
  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the social media entry",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    example: "LinkedIn",
    description: "Name of the social media",
  })
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: "https://www.linkedin.com/in/johndoe/",
    description: "Url of the social media",
  })
  @IsString()
  url?: string;
}
