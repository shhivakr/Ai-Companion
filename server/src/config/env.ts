import "dotenv/config";
import type { StringValue } from "ms";

const requiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  CLIENT_URL: requiredEnv("CLIENT_URL"),
  MONGODB_URI: requiredEnv("MONGODB_URI"),

  JWT_ACCESS_SECRET: requiredEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: requiredEnv("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES_IN: requiredEnv("JWT_ACCESS_EXPIRES_IN") as StringValue,
  JWT_REFRESH_EXPIRES_IN: requiredEnv("JWT_REFRESH_EXPIRES_IN") as StringValue,
};
