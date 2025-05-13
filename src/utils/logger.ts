import { pino, transport } from "pino";
import { Config, Environment } from "../config/index.js";

const developmentConfig = {
  transport: {
    target: "pino-pretty",
  },
};

function createLogger() {
  let config = {};

  if (Config.ENV === Environment.development) {
    config = { ...config, ...developmentConfig };
  }

  return pino(config);
}

export const logger = createLogger();
