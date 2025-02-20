import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class DeleteCvFieldsByIdDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ["1", "2", "3"],
    description: "Ids of the experience entries to be deleted",
  })
  expirience: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ["1", "2", "3"],
    description: "Ids of the education entries to be deleted",
  })
  education: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ["1", "2", "3"],
    description: "Ids of the project entries to be deleted",
  })
  projects: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ["1", "2", "3"],
    description: "Ids of the course entries to be deleted",
  })
  courses: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ["1", "2", "3"],
    description: "Ids of the certificate entries to be deleted",
  })
  certificates: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ["1", "2", "3"],
    description: "Ids of the language entries to be deleted",
  })
  languages: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ["1", "2", "3"],
    description: "Ids of the social entries to be deleted",
  })
  socials: string[];
}
