import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
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
}
