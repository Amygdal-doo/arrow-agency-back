import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { CreateSubscriptionPlanDto } from "./dtos/requests/create-subscription-plan.dto";
import { ILoggedUserInfo } from "../auth/interfaces/logged-user-info.interface";
import { MonriService } from "../monri/monri.service";

@Injectable()
export class SubscriptionPlanService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly monriService: MonriService
  ) {}

  private readonly subscriptionPlanModel =
    this.databaseService.subscriptionPlan;

  async findById(id: string) {
    return this.subscriptionPlanModel.findUnique({ where: { id } });
  }

  async findAll() {
    return this.subscriptionPlanModel.findMany();
  }

  async create(data: Prisma.SubscriptionPlanCreateInput) {
    return this.subscriptionPlanModel.create({ data });
  }

  async createSubPlan(
    subscriptionPlan: CreateSubscriptionPlanDto,
    loggedUserInfo: ILoggedUserInfo
  ) {
    // first create sub plan on monri
    const monriSubPlan = await this.monriService.createPlan(subscriptionPlan);
    // then create sub plan on db
    return;
  }
}
