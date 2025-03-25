import { JobSkill } from "@prisma/client";
import { SkillResponseDto } from "./skill.response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class JobSkillsResponseDto implements JobSkill {
  @ApiProperty({
    example: "4b97a2a8-54c1-4f6f-9b9a-4c9a3b0df5f2",
    description: "The id of the job that this skill belongs to",
  })
  @Expose()
  jobId: string;

  @ApiProperty({
    example: "4b97a2a8-54c1-4f6f-9b9a-4c9a3b0df5f3",
    description: "The id of the skill that this job has",
  })
  @Expose()
  skillId: string;

  @ApiProperty({
    example: SkillResponseDto,
    description: "The skill that this job has",
  })
  @Expose()
  @Type(() => SkillResponseDto)
  skill: SkillResponseDto;
}
