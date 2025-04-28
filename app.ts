import express from "express";

import { PORT } from "./config/env.ts";

import authRouter from "./routes/auth.routes.ts";
import userRouter from "./routes/user.routes.ts";
import subscriptionRouter from "./routes/subscription.routes.ts";
import connectToDatabase from "./database/mongodb.ts";

const app = express();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Subscription Tracker API!");
});

app.listen(PORT, async () => {
  console.log(
    `Subscription Tracker API is running on http://localhost:${PORT}`
  );

  await connectToDatabase();
});

export default app;
