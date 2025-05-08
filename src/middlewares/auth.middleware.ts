import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import User from "../models/user.model.ts";
import { JWT_SECRET } from "../config/env.ts";
import { AuthenticatedRequest, JwtPayload } from "../types/index.ts";

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    (req as AuthenticatedRequest).user = user;

    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: "Unauthorized", error: error.message });
    } else {
      res.status(401).json({ message: "Unauthorized", error: String(error) });
    }
  }
};

export default authorize;
