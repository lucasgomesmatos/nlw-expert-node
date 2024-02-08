import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  COOKIE_SECRET: z.string().default('secret'),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('Invalid environment variables', env.error.format());
  throw new Error('Invalid environment variables.');
}

export const environment = env.data;
