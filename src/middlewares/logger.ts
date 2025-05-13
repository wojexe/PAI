import { pinoHttp, type Options } from "pino-http";

import { logger } from "../utils/logger.js";
import { Config, Environment } from "../config/index.js";

const developmentConfig: Options = {
  serializers: {
    req: (req) => {
      req.body = req.raw.body;
      return req;
    }
  },
};

function createRequestLogger() {
  let config = {
    logger,
  };

  if (Config.ENV === Environment.development) {
    config = { ...config, ...developmentConfig };
  }

  return pinoHttp(config);
}

export const loggerMiddleware = createRequestLogger();
