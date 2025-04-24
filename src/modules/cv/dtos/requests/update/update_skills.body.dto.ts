import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { EfficiencyLevel } from "src/modules/pdf/interfaces/cv-data.interface";

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
    example: EfficiencyLevel.beginner,
    description: "Proficiency level in the skill",
  })
  @IsEnum(EfficiencyLevel)
  @IsOptional()
  efficiency: EfficiencyLevel;

  @ApiPropertyOptional({
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  effiencyTypeNumber: boolean;

  // @ApiPropertyOptional({
  //   example: "3298457942857024704",
  //   description: "Identifier of the associated CV",
  // })
  // @IsString()
  // @IsOptional()
  // cvId: string;
}
