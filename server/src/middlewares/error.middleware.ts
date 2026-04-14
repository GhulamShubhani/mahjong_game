import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      message: err.message
    });
  }

  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session"
    });
  }

  const mongo = err as { code?: number; name?: string; kind?: string };
  if (mongo.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with that unique field already exists"
    });
  }
  if (mongo.name === "CastError" || mongo.kind === "ObjectId") {
    return res.status(400).json({
      success: false,
      message: "Invalid id"
    });
  }

  const anyErr = err as { status?: number; message?: string };
  const status = anyErr.status ?? 500;
  const message =
    status === 500
      ? "Internal Server Error"
      : anyErr.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message
  });
};