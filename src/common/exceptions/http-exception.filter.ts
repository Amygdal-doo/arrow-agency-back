import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

interface ValidatorExceptionResponse {
  error?: string;
  message?: string | string[];
  statusCode?: number;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger();

  // Add try/catch to handle any potential errors in the filter itself
  catch(exception: HttpException, host: ArgumentsHost) {
    try {
      //In case we throw exceptions we created, we may need these objects
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
      const message = exception.message;
      const name = exception.name;

      //For handling class-validator package errors we need this approach
      const exceptionResponse = exception.getResponse();

      let errorType = name;
      let errorList: string[] = [];
      let statusCode = status;

      // Check if the exception response is an object (for validator exceptions)
      if (typeof exceptionResponse === "object") {
        const validatorException =
          exceptionResponse as ValidatorExceptionResponse;
        errorType = validatorException["error"] || name;
        statusCode = validatorException["statusCode"] || status;

        // Convert message to array regardless of type
        if (validatorException["message"]) {
          if (Array.isArray(validatorException["message"])) {
            errorList = validatorException["message"];
          } else {
            errorList = [validatorException["message"] as string];
          }
        }
      }

      // If errorList is still empty, use the exception message
      if (errorList.length === 0) {
        errorList = [message];
      }

      // logging
      this.logger.error(
        `${request.method} ${request.originalUrl} ${status} error: ${exception.message}`
      );

      console.log({ errorList, message });

      return response.status(statusCode).json({
        statusCode: statusCode,
        errors: errorList, // Now always an array
        type: errorType,
      });
    } catch (error) {
      this.logger.error(`Exception filter failed: ${error.message}`);
      const response = host.switchToHttp().getResponse<Response>();
      return response.status(500).json({
        statusCode: 500,
        errors: ["Internal server error"],
        type: "InternalServerError",
      });
    }
  }
}
