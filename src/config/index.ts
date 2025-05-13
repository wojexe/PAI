import "dotenv/config";
import * as v from "valibot";
import fs from "node:fs";

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
  DB_FILE_NAME: v.string(),
  CAPSULES_FOLDER: v.pipe(
    v.string(),
    v.custom<string>(
      (s) =>
        typeof s === "string" &&
        fs.existsSync(s) &&
        fs.statSync(s).isDirectory(),
      "Capsules folder does not exist"
    )
  ),
});

export type Config = v.InferOutput<typeof configSchema>;

export const Config = v.parse(configSchema, process.env);
