import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class UploadDto {
  @ApiProperty({ type: "string", format: "binary" })
  file: any; // File will be handled separately

  @ApiProperty({ type: [String] })
  //   @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => {
    console.log(value);
    // if case value = "node,ts,js" then return ["node","ts","js"]
    // if case value = "["node","ts","js"]" then return ["node","ts","js"]
    return typeof value === "string"
      ? value.startsWith("[") && value.endsWith("]")
        ? JSON.parse(value)
        : value.split(",")
      : value;
    // return typeof value === "string" ? JSON.parse(value) : value;
  })
  technologies: string[];

  @ApiProperty({
    example: true,
    description: "Set to true if you want to make your cv public",
  })
  publicCv: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  logoId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  primaryColor: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  secondaryColor: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tertiaryColor: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === "true" || value === "1")
  showPersonalInfo: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === "true" || value === "1")
  showCompanyInfo: boolean;
}
