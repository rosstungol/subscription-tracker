import { workflowClient } from "../config/upstash.ts";
import { Request, Response, NextFunction, RequestHandler } from "express";

import Subscription from "../models/subscription.model.ts";
import { AuthenticatedRequest, CustomError } from "../types/index.ts";
import { SERVER_URL } from "../config/env.ts";

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

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    res
      .status(201)
      .json({ success: true, data: { subscription, workflowRunId } });
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
