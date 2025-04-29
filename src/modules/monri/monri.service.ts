import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, Subscription } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { addMonths, format } from "date-fns";
import { IDigest, IReqDigest } from "src/common/interfaces/digest.interface";
import { calculateDigest, reqDigest } from "src/common/helper/digest.helper";
import { ISubscription } from "./interfaces/subscription.interface";
import { SubscriptionPlanResponseDto } from "./dtos/response/subscription_plan.response.dto";
import { Customer, MonriCurrency, SUBSCRIPTION_PERIOD } from "@prisma/client";
import { ICreateCustomer } from "./interfaces/create_customer.interface";
import axios from "axios";
import {
  MonriTransaction,
  MonriTransactionRequest,
} from "./interfaces/transaction.interface";
import { ISubPaymentParams } from "./interfaces/sub-payment-params.interface";
import { ICardOnFileResponse } from "./interfaces/card_on_file_response.interface";
import { getServerIp } from "src/common/helper/get_server_ip.helper";

@Injectable()
export class MonriService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  private readonly logger: Logger = new Logger(MonriService.name);

  private readonly MONRI_API_URL = this.configService.get("MONRI_URL");
  private readonly MONRI_API_TOKEN = this.configService.get("MONRI_KEY");
  private readonly MONRI_AUTHENTICITY_TOKEN = this.configService.get(
    "MONRI_AUTHENTICITY_TOKEN"
  );

  private readonly SCHEMA = `WP3-v2.1`;

  /** Returns headers with authorization token */
  private getHeaders() {
    return {
      // Authorization: `Bearer ${this.MONRI_API_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * Creates a customer in Monri
   * @param customerData Customer details (e.g., name, email)
   * @returns Customer object with ID
   */
  async createCustomer(customerData: ICreateCustomer): Promise<any> {
    const fullpath = "/v2/customers";
    const timestamp = new Date().getTime();
    const digestData: IReqDigest = {
      fullpath,
      timestamp,
      merchantKey: this.MONRI_API_TOKEN,
      authenticityToken: this.MONRI_AUTHENTICITY_TOKEN,
      body: JSON.stringify(customerData),
    };
    this.logger.debug({ digestData });
    const digest = reqDigest(digestData);
    this.logger.debug({ digest });
    try {
      // const
      // const response = await firstValueFrom(
      //   this.httpService.post(
      //     `${this.MONRI_API_URL}${fullpath}`,
      //     customerData,
      //     {
      //       headers: {
      //         ...this.getHeaders(),
      //         Authorization: `${this.SCHEMA} ${this.MONRI_AUTHENTICITY_TOKEN} ${timestamp} ${digest}`,
      //       },
      //     }
      //   )
      // );
      const response = await axios.post(
        `${this.MONRI_API_URL}${fullpath}`,
        customerData,
        {
          headers: {
            ...this.getHeaders(),
            Authorization: `${this.SCHEMA} ${this.MONRI_AUTHENTICITY_TOKEN} ${timestamp} ${digest}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      //   this.logger.error(
      //     "Error creating customer:",
      //     error.response?.data || error.message
      //   );
      this.logger.error("here");
      this.logger.debug({
        status: error.response?.status,
        data: error.response?.data,
      });
      //   throw new BadRequestException(error.response?.data);
      return;
    }
  }

  /**
   * Attaches a payment method to a customer
   * @param customerId The customer's ID
   * @param token Tokenized payment method from client-side
   * @returns Payment method details
   */
  async attachPaymentMethod(customerId: string, token: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.MONRI_API_URL}/customers/${customerId}/payment_methods`,
          { token },
          { headers: this.getHeaders() }
        )
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        "Error attaching payment method:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Creates a subscription plan in Monri
   * @param planData Subscription plan details (e.g., name, price, period)
   * @returns Plan object with ID
   */
  async createPlan(
    planData: ISubscription
  ): Promise<SubscriptionPlanResponseDto> {
    const fullpath = "/v2/subscriptions";
    const timestamp = new Date().getTime();
    const digestData: IReqDigest = {
      fullpath,
      timestamp,
      merchantKey: this.MONRI_API_TOKEN,
      authenticityToken: this.MONRI_AUTHENTICITY_TOKEN,
      body: JSON.stringify(planData),
    };
    this.logger.debug({ digestData });
    const digest = reqDigest(digestData);
    this.logger.debug({ digest, url: `${this.MONRI_API_URL}${fullpath}` });
    try {
      // const response: any = await firstValueFrom(
      //   this.httpService.post(`${this.MONRI_API_URL}${fullpath}`, planData, {
      //     headers: {
      //       ...this.getHeaders(),
      //       Authorization: `${this.SCHEMA} ${this.MONRI_AUTHENTICITY_TOKEN} ${timestamp} ${digest}`,
      //     },
      //   })
      // );
      const response: any = await axios.post(
        `${this.MONRI_API_URL}${fullpath}`,
        planData,
        {
          headers: {
            ...this.getHeaders(),
            Authorization: `${this.SCHEMA} ${this.MONRI_AUTHENTICITY_TOKEN} ${timestamp} ${digest}`,
          },
        }
      );

      console.log({
        response,
        data: response.data,
      });

      return response;
    } catch (error) {
      this.logger.error("Error creating plan:", error.message, error.status);
      console.log(error.response);
      throw new InternalServerErrorException("Error creating plan");

      // throw error;
    }
  }

  /**
   * Creates a subscription for a customer
   * @param subscriptionData Subscription details (e.g., customer_id, plan_id)
   * @returns Subscription object with ID
   */
  async createSubscription(subscriptionData: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.MONRI_API_URL}/customer-subscriptions`,
          subscriptionData,
          {
            headers: this.getHeaders(),
          }
        )
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        "Error creating subscription:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Executes the full process: create customer, attach payment method, create plan, and subscribe
   */
  async createCustomerSubscription(): Promise<any> {
    try {
      // Step 1: Create a customer
      const customerData = {
        name: "John Doe",
        email: "john.doe@example.com",
        // Add other required fields as per Monri API docs (e.g., address, phone)
      };
      const customer = await this.createCustomer(customerData);
      this.logger.debug({ customer });
      this.logger.log("Customer created with ID:", customer?.uuid);
      // return;
      //   console.log({ customer });

      // Step 2: Attach a payment method
      const paymentToken = "tok_abc123"; // Replace with actual token from Monri Components
      const paymentMethod = await this.attachPaymentMethod(
        customer.id,
        paymentToken
      );
      this.logger.log("Payment method attached with ID:", paymentMethod.id);

      //   console.log({ paymentMethod });

      // Step 3: Create a subscription plan
      const planData: ISubscription = {
        name: "Monthly Plan",
        description: "Monthly subscription plan",
        price: 1000, // 10.00 EUR in minor units (cents)
        currency: MonriCurrency.EUR,
        period: SUBSCRIPTION_PERIOD.month,
        // Add other required fields as per Monri API docs
      };
      const plan = await this.createPlan(planData);
      this.logger.log("Subscription plan created with ID:", plan.id);

      //   console.log({ plan });

      // Step 4: Create a customer subscription
      const subscriptionData = {
        customer_id: customer.id,
        subscription_id: plan.id,
        next_charge_date: format(addMonths(new Date(), 1), "yyyy-MM-dd"), // Next charge date is one month from now
        active_from: format(new Date(), "yyyy-MM-dd"), // Subscription starts today
        active_to: format(addMonths(new Date(), 1), "yyyy-MM-dd"), // Subscription is active for one month
      };
      const subscription = await this.createSubscription(subscriptionData);
      this.logger.log(
        "Customer subscription created with ID:",
        subscription.id
      );

      //   console.log({ subscription });

      return {
        customer,
        paymentMethod,
        plan,
        subscription,
      };
    } catch (error) {
      this.logger.error("Error in subscription process:", error);
      throw error;
    }
  }

  async cardOnFilePayment(
    data: ISubPaymentParams
  ): Promise<ICardOnFileResponse> {
    const ip = getServerIp();
    this.logger.debug({ ip });
    const fullpath = "/v2/transaction";
    const timestamp = new Date().getTime();
    // still not finished
    const requestBody: MonriTransactionRequest = {
      transaction: {
        transaction_type: "purchase",
        amount: data.amount,
        ip,
        order_info: `Subscription payment for ${data.plan_name} plan`,
        ch_address: data.customer.address,
        ch_city: data.customer.city,
        ch_country: data.customer.country,
        ch_email: data.customer.email,
        ch_full_name: data.customer.fullName,
        ch_phone: data.customer.phone,
        ch_zip: data.customer.zip,
        currency: data.currency,
        cit_id: `tkn_${data.cit_id}`,
        digest: "",
        order_number: data.order_number,
        authenticity_token: this.MONRI_AUTHENTICITY_TOKEN,
        merchant_initiated_transaction: true,
        language: "en",
        pan_token: data.pan_token,
        moto: true,
      },
    };

    const bodyDigestInput: IDigest = {
      currency: data.currency,
      order_number: data.order_number,
      amount: data.amount.toString(),
    };

    // Calculate body digest: SHA512(merchant_key + order_number + amount + currency)
    // Body digest is used to verify the integrity of the request
    const bodyDigest = calculateDigest(this.MONRI_API_TOKEN, bodyDigestInput);
    requestBody.transaction["digest"] = bodyDigest;
    console.log({ requestBody });

    const digestData: IReqDigest = {
      fullpath,
      timestamp,
      merchantKey: this.MONRI_API_TOKEN,
      authenticityToken: this.MONRI_AUTHENTICITY_TOKEN,
      body: JSON.stringify(requestBody),
    };
    this.logger.debug({ digestData });
    // Calculate request digest: SHA512(merchant_key + timestamp + authenticity_token + fullpath + body)
    // Request digest is used to verify the integrity of the request
    const digest = reqDigest(digestData);
    this.logger.debug({ digest });
    this.logger.debug({ digest, url: `${this.MONRI_API_URL}${fullpath}` });
    try {
      const response = await axios.post(
        `${this.MONRI_API_URL}${fullpath}`,
        requestBody,
        {
          headers: {
            ...this.getHeaders(),
            Authorization: `${this.SCHEMA} ${this.MONRI_AUTHENTICITY_TOKEN} ${timestamp} ${digest}`,
          },
        }
      );
      console.log("1221", response.data);

      const { status } = response.data;

      console.log("status", status);

      return {
        success: status === "approved",
        status: status,
        monriTransactionId: response.data.id,
        rawResponse: response.data,
      };
    } catch (error) {
      //   this.logger.error(
      //     "Error creating customer:",
      //     error.response?.data || error.message
      //   );
      this.logger.error("here");
      this.logger.debug({
        status: error.response?.status,
        data: error.response?.data,
      });
      //   throw new BadRequestException(error.response?.data);
      return {
        success: false,
        status: "invalid",
        message: error.response?.data?.message || error.message,
      };
    }
  }
}
