import { Injectable, NestMiddleware } from "@nestjs/common";
import * as bodyParser from "body-parser";
import type { Request, Response } from "express";

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any): void {
    bodyParser.json()(req, res, next);
  }
}

// Middleware that parses incoming requests with JSON payloads.
// Uses the body-parser library to convert the raw JSON request body into a JavaScript object,
// making it accessible via req.body in route handlers.
