import { z } from "zod"

const configSchema = z.object({
  postgresUrl: z.string().min(1, "POSTGRES_URL is required"),
  nodeEnv: z.enum(["development", "production", "test"]).default("development"),
  appUrl: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
})

export const config = configSchema.parse({
  postgresUrl: process.env.POSTGRES_URL,
  nodeEnv: process.env.NODE_ENV,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
})
