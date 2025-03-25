import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from "class-validator";

export class CreateSkillDto implements Prisma.SkillCreateInput {
  @ApiProperty({ example: "Nodejs", description: "The name of the skill" })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: "This is my skill",
    description: "The description of the skill",
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  description?: string;
}
