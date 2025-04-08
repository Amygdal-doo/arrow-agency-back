import { Module } from "@nestjs/common";
import { MonriService } from "./monri.service";
import { MonriController } from "./monri.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [MonriService],
  controllers: [MonriController],
  exports: [MonriService],
})
export class MonriModule {}
