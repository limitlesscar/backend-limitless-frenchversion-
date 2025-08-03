import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class HTTPLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HTTP");
  use(request: Request, response: Response, next: NextFunction): void {
    response.on("finish", () => {
      const { method, originalUrl, ip: ip_address } = request;
      const { statusCode, statusMessage } = response;
      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;
      if (statusCode >= 500) {
        return this.logger.error({ message, ip_address });
      } else if (statusCode >= 400) {
        return this.logger.warn({ message, ip_address });
      }
      return this.logger.log({ message, ip_address });
    });
    next();
  }
}

// Middleware that logs HTTP requests and responses.
// It logs the request method, URL, response status code, and status message along with the client IP.
// Errors (500+) are logged as errors, client errors (400–499) as warnings, and others as standard logs.
// This helps track and debug API traffic and issues.
