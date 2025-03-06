import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateSkillsDto {
  @ApiPropertyOptional({
    example: "Software Engineer",
    description: "Name of the skill",
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    example: "1a2b3c4d5e6f7g8h9i0j",
    description: "Unique identifier for the skill",
  })
  @IsString()
  @IsOptional()
  id: string;

  @ApiPropertyOptional({
    example: "intermediate",
    description: "Proficiency level in the skill",
  })
  @IsString()
  @IsOptional()
  efficiency: string;

  @ApiPropertyOptional({
    example: "3298457942857024704",
    description: "Identifier of the associated CV",
  })
  @IsString()
  @IsOptional()
  cvId: string;
}
