import dayjs, { Dayjs } from "dayjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

import Subscription from "../models/subscription.model.ts";
import { Context } from "../types";
import { SubscriptionType } from "../types/models.ts";
import { sendReminderEmail } from "../utils/send-email.js";

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context: Context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription) {
    console.log("No subscription found for ID:", subscriptionId);
    return;
  }

  if (subscription.status !== "active") {
    console.log("Skipping. Subscription is not active:", subscription.status);
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `${daysBefore} days before reminder`,
        reminderDate
      );
    }

    if (dayjs().isSame(reminderDate, "day")) {
      await triggerReminder(
        context,
        `${daysBefore} days before reminder`,
        subscription
      );
    }
  }
});

const fetchSubscription = async (
  context: Context,
  subscriptionId: string
): Promise<SubscriptionType | null> => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (
  context: Context,
  label: string,
  date: Dayjs
) => {
  console.log(`Sleeping until ${label} at ${date}`);

  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (
  context: Context,
  label: string,
  subscription: SubscriptionType
): Promise<void> => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label}`);

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });
};
