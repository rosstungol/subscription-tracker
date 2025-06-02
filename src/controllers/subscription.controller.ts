import { Request, Response, NextFunction, RequestHandler } from "express";

import Subscription from "../models/subscription.model.ts";
import { AuthenticatedRequest } from "../types/index.ts";

export const createSubscription: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthenticatedRequest;

    const subscription = await Subscription.create({
      ...req.body,
      user: user._id,
    });

    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};
