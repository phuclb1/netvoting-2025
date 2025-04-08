import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const zBool = z
  .string()
  .transform((s) => s !== "false" && s !== "0")
  .default("1");

export const env = createEnv({
  server: {
    DEBUG_AUTH: zBool,
    DEBUG_MIDDLEWARE: zBool,
    DEBUG_SKIP_AUTH: zBool.default("0"),

    BACKEND_API_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_CICD_BUILD_PLATFORM: z
      .enum(["DEV", "QA", "PROD"])
      .default("DEV"),
    NEXT_PUBLIC_KEY: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_KEY: process.env.NEXT_PUBLIC_KEY,
    NEXT_PUBLIC_CICD_BUILD_PLATFORM:
      process.env.NEXT_PUBLIC_CICD_BUILD_PLATFORM,
  },
});
