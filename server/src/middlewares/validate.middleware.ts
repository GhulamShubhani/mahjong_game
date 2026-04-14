import { NextFunction, Request, Response } from "express";

type ValidateSource = "body" | "query" | "params";

export const validate = (schema: any, source: ValidateSource = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const payload =
      source === "body"
        ? req.body
        : source === "query"
          ? req.query
          : req.params;
    const { error, value } = schema.validate(payload, {
      abortEarly: true,
      stripUnknown: true
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0]?.message ?? "Validation failed"
      });
    }
    if (source === "body") {
      req.body = value;
    } else if (source === "query") {
      Object.assign(req.query as object, value);
    } else {
      Object.assign(req.params, value);
    }
    next();
  };
};