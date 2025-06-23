import { config } from "dotenv";
import { z } from "zod";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

const envSchema = z.object({
  PORT: z.string().default("5500"),
  SERVER_URL: z.string().default("http://localhost:5500"),
  NODE_ENV: z.string().default("development"),
  DB_URI: z.string().min(1, "DB_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  ARCJET_KEY: z.string().min(1, "ARCJET_KEY is required"),
  ARCJET_ENV: z.string().default("development"),
  QSTASH_TOKEN: z.string().min(1, "QSTASH_TOKEN is required"),
  QSTASH_URL: z.string().min(1, "QSTASH_URL is required"),
  EMAIL_PASSWORD: z.string(),
});

const env = envSchema.parse(process.env);

export const {
  PORT,
  SERVER_URL,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ARCJET_KEY,
  ARCJET_ENV,
  QSTASH_TOKEN,
  QSTASH_URL,
  EMAIL_PASSWORD,
} = env;
