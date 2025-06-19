import { Request } from "express";

import { UserType } from "./models";

// Middleware
export type CustomError = Error & {
  statusCode?: number;
  code?: number;
  errors?: Record<string, { message: string }>;
};

export type JwtPayload = {
  userId: string;
  iat?: number;
  exp?: number;
};

export type AuthenticatedRequest = Request & {
  user: UserType;
};

export type Context = {
  requestPayload: {
    subscriptionId: string;
  };
  run: <T>(label: string, fn: () => Promise<T>) => Promise<T>;
  sleepUntil: (label: string, date: Date) => Promise<void>;
};
