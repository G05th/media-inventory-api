// src/common/middleware/log-auth.middleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LogAuthMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    console.log("Authorization header:", req.headers.authorization);
    next();
  }
}
