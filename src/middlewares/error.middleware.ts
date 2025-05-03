import { Request, Response, NextFunction } from "express";

import { CustomError } from "../types/index.ts";

const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let error: CustomError;

    if (typeof err === "object" && err !== null && "message" in err) {
      error = { ...(err as object) } as CustomError;
      error.message = (err as Error).message;
    } else {
      error = new Error("Unknown Error") as CustomError;
    }

    console.error(err);

    // Mongoose bad ObjectId
    if (error.name === "CastError") {
      error = new Error("Resource not found") as CustomError;
      error.statusCode = 404;
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
      error = new Error("Duplicate field value entered") as CustomError;
      error.statusCode = 400;
    }

    //Mongoose validation error
    if (error.name === "ValidationError" && error.errors) {
      const messages = Object.values(error.errors).map((val) => {
        if (typeof val === "object" && val !== null && "message" in val) {
          return val.message;
        }
        return "Validation error";
      });

      error = new Error(messages.join(", ")) as CustomError;
      error.statusCode = 400;
    }

    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message || "Server Error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
