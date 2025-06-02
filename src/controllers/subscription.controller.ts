import { Request, Response, NextFunction, RequestHandler } from "express";

import Subscription from "../models/subscription.model.ts";
import { AuthenticatedRequest, CustomError } from "../types/index.ts";

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

export const getUserSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthenticatedRequest;

    // Check if the user is the same as the one in the token
    if (user._id.toString() !== req.params.id) {
      const error: CustomError = new Error(
        "You are not the owner of this account"
      );
      error.statusCode = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};
