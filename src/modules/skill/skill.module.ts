import { Module } from "@nestjs/common";
import { SkillController } from "./controllers/skill.controller";
import { SkillService } from "./services/skill.service";

@Module({
  controllers: [SkillController],
  providers: [SkillService],
})
export class SkillModule {}
