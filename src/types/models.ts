// User
export type UserType = {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
};

// Subscription
type Currency = "USD" | "EUR" | "GBP";
export type Frequency = "daily" | "weekly" | "monthly" | "yearly";
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

export type SubscriptionType = {
  name: string;
  price: number;
  currency: Currency;
  frequency: Frequency;
  category: Category;
  paymentMethod: string;
  status: Status;
  startDate: Date;
  renewalDate?: Date;
  user: UserType;
  createdAt: Date;
  updatedAt: Date;
};
