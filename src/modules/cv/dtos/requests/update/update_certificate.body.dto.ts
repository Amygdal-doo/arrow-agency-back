import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID, IsOptional, IsString } from "class-validator";

export class UpdateCertificateDto {
  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the certificate",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    example: "Software Engineer",
    description: "Name of the certificate",
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: "Coding Dojo",
    description: "Issuer of the certificate",
  })
  @IsString()
  @IsOptional()
  issuer?: string;

  @ApiPropertyOptional({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the certificate was issued",
  })
  @IsString()
  @IsOptional()
  issueDate?: string;

  @ApiPropertyOptional({
    example: "2024-01-01T00:00:00.000Z",
    description: "Date when the certificate was expired",
  })
  @IsString()
  @IsOptional()
  expirationDate?: string;

  @ApiPropertyOptional({
    example: "https://example.com",
    description: "Url of the certificate",
  })
  @IsString()
  @IsOptional()
  url?: string;
}
