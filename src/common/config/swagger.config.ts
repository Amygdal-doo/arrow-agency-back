import { DocumentBuilder } from "@nestjs/swagger";

export const configSwagger = new DocumentBuilder()
  .setTitle("cv scrappy app")
  .setDescription("Swagger Scrappy app")
  .setVersion(`API version: 0.1`)
  .addTag("cv scrappy app")
  .addBearerAuth(
    {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      name: "JWT",
      description: "Enter access token",
      in: "header",
    },
    "Access Token"
  )
  .build();
