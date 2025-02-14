import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ApplicantService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: Prisma.applicantCreateInput) {
    return this.databaseService.applicant.create({ data });
  }

  async findById(id: string) {
    return this.databaseService.applicant.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.databaseService.applicant.findUnique({ where: { email } });
  }

  async findAll() {
    return this.databaseService.applicant.findMany();
  }

  async updateByEmail(email: string, data: Prisma.applicantUpdateInput) {
    return this.databaseService.applicant.update({
      where: { email },
      data,
    });
  }
}
