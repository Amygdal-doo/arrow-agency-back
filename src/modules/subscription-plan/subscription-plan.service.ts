import { BadRequestException, Injectable } from "@nestjs/common";
import { MonriCurrency, Prisma } from "@prisma/client";
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

  async createSubPlan(subscriptionPlan: CreateSubscriptionPlanDto) {
    const { name, price, period, description } = subscriptionPlan;
    const currency = MonriCurrency.USD;

    const existingSubPlan = await this.subscriptionPlanModel.findFirst({
      where: { name },
    });
    if (existingSubPlan) {
      throw new BadRequestException("Subscription plan already exist");
    }
    // first create sub plan on monri
    // const monriSubPlan = await this.monriService.createPlan(subscriptionPlan);
    const subPlan = await this.create({
      name,
      price,
      period,
      description,
      currency,
    });
    // then create sub plan on db
    return subPlan;
  }
}
