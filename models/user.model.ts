import mongoose, { Schema, Model } from "mongoose";

type UserType = {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minLength: 6,
    },
  },
  { timestamps: true }
);

const User: Model<UserType> =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
