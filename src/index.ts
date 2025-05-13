import { app } from "./routes/index.js";
import { Config } from "./config/index.js";
import { logger } from "./utils/logger.js";

app.listen(Config.PORT, () => {
  logger.info(null, `Listening on http://localhost:${Config.PORT}`);
});
