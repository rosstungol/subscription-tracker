import mongoose, { Schema, Model, Types } from "mongoose";

type Currency = "USD" | "EUR" | "GBP";
type Frequency = "daily" | "weekly" | "monthly" | "yearly";
type Category =
  | "sports"
  | "news"
  | "entertainment"
  | "lifestyle"
  | "technology"
  | "finance"
  | "politics"
  | "others";
type Status = "active" | "cancelled" | "expired";

type SubscriptionType = {
  name: string;
  price: number;
  currency: Currency;
  frequency: Frequency;
  category: Category;
  paymentMethod: string;
  status: Status;
  startDate: Date;
  renewalDate?: Date;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const subscriptionSchema = new Schema<SubscriptionType>(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Price must be greater than 0"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "others",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (this: SubscriptionType, value: Date) {
          return !value || value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Auto-calculate renewal date if missing
subscriptionSchema.pre("save", function (next) {
  const sub = this as mongoose.Document & SubscriptionType;

  if (!sub.renewalDate) {
    const renewalPeriods: Record<Frequency, number> = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    sub.renewalDate = new Date(this.startDate);
    sub.renewalDate.setDate(
      sub.renewalDate.getDate() + renewalPeriods[sub.frequency]
    );
  }

  if (sub.renewalDate < new Date()) {
    sub.status = "expired";
  }

  next();
});

const Subscription: Model<SubscriptionType> =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
