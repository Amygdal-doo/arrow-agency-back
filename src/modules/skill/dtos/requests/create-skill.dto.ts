import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsString, MinLength, MaxLength } from "class-validator";

export class CreateSkillDto implements Prisma.SkillCreateInput {
  @ApiProperty({ example: "Nodejs", description: "The name of the skill" })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: "This is my skill",
    description: "The description of the skill",
  })
  @IsString()
  @MaxLength(255)
  description?: string;
}
