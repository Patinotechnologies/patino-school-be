import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  databaseUrl: required("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/patino_schools_dev"),
  jwtSecret: required("JWT_SECRET", process.env.NODE_ENV === "production" ? undefined : "dev-only-insecure-secret"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  // Comma-separated list of allowed frontend origins, e.g. "https://app.patino.com,https://staging.patino.com".
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:3001").split(",").map((origin) => origin.trim()),
};
