import "dotenv/config";
import * as v from "valibot";

export const Environment = {
  production: "production",
  development: "development",
} as const;

const configSchema = v.looseObject({
  ENV: v.enum(Environment),
  PORT: v.pipe(
    v.string(),
    v.transform((s) => Number.parseInt(s))
  ),
});

export type Config = v.InferOutput<typeof configSchema>;

export const Config = v.parse(configSchema, process.env);
