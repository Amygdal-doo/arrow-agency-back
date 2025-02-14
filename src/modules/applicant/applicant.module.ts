import { Module } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { ApplicantController } from './applicant.controller';

@Module({
  providers: [ApplicantService],
  controllers: [ApplicantController],
  exports: [ApplicantService],
})
export class ApplicantModule {}
