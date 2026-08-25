import type { RequestHandler } from "express";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export interface AuthenticatedRequest extends Express.Request {
  userId?: string;
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401);
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const payload = verifyAccessToken(token);

    (req as AuthenticatedRequest).userId = payload.userId;

    next();
  } catch {
    next(new AppError("Invalid or expired access token", 401));
  }
};
