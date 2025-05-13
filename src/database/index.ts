import { drizzle } from "drizzle-orm/libsql";

import { Config } from "../config/index.js";

export const db = drizzle(Config.DB_FILE_NAME);
