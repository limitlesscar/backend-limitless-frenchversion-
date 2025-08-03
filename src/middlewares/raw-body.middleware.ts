import { Injectable, NestMiddleware } from "@nestjs/common";
import * as bodyParser from "body-parser";
import type { Request, Response } from "express";

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any): void {
    bodyParser.raw({ type: "*/*" })(req, res, next);
  }
}
// Middleware that parses the raw body of incoming requests,
// supporting all content types (`*/*`), making the raw buffer available on req.body.
// Useful for scenarios like verifying webhooks or processing non-JSON payloads.
