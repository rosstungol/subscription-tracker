import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.ts";

if (!DB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env<development/production>.local"
  );
}

const dbUri: string = DB_URI;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log(`Connected to database in ${NODE_ENV} mode`);
  } catch (error) {
    handleFatalError("Error connecting to the database", error, 1);
  }
};

function handleFatalError(message: string, error: unknown, exitCode = 1) {
  console.error(`${message}:`, error instanceof Error ? error.message : error);
  process.exit(exitCode);
}

export default connectToDatabase;
