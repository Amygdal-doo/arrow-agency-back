import { Injectable } from "@nestjs/common";
import * as sgMail from "@sendgrid/mail";
import { ConfigService } from "@nestjs/config";
import { template_easy_apply } from "./template/template_easy_apply";

@Injectable()
export class SendgridService {
  private readonly FROM = this.configService.get<string>("SENDGRID_FROM_EMAIL");
  //   private readonly FRONTEND_URL = this.configService.get("FRONTEND_URL");

  constructor(
    private readonly configService: ConfigService
    // private readonly userService: UserService,
  ) {
    sgMail.setApiKey(this.configService.get<string>("SENDGRID_API_KEY"));
  }

  async send(mail: sgMail.MailDataRequired) {
    try {
      const transport = await sgMail.send(mail);
      if (transport) {
        // console.log(`Email successfully dispatched to ${mail.to}`)
        return {
          message: `Email successfully sent to ${mail.to}`,
        };
      } else return "Email failed to send";
    } catch (error) {
      console.log(error.response.body);
      return "Email failed to send";
    }
  }

  async easyApply(email: string, cvUrl: string) {
    const mail: sgMail.MailDataRequired = {
      subject: "Easy Apply - Arrow agency",
      to: email,
      from: this.FROM,
      html: template_easy_apply({ cvUrl }),
      //   templateId,
      //   dynamicTemplateData,
    };

    return this.send(mail);
  }
}
