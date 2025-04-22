import { IEasyApplyTemplateData } from "../interfaces/easy_apply_template_data.interface";

export function template_easy_apply(data: IEasyApplyTemplateData) {
  const htmlTemplateString = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Easy Application Received</title>
        <style>
          body {
            font-family: sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <p>Dear Hiring Manager,</p>
          <p>A new candidate has submitted an easy application for your job posting.</p>
          <p>You can review the applicant's CV by clicking the link below:</p>
          <p><a href="${data.cvUrl}" class="button">View Applicant's CV</a></p>
          <p>Thank you for using our platform.</p>
          <p>Sincerely,<br />The Your Application Platform Team</p>
        </div>
      </body>
    </html>`;

  return htmlTemplateString;
}
