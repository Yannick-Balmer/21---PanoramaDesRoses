import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

const envFile = process.env.ENV_FILE ?? '.env.development';

dotenv.config({
  path: `env/${envFile}`,
});

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node prisma/seed.ts",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});


