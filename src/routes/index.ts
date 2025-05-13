import express from "express";

import { router as capsulesRouter } from "./capsules/index.js";
import { globalMiddlewares } from "./../middlewares/index.js";

export const app = express();
export const router = app.router;

app.set("views", "./src/views");
app.set("view engine", "pug");

app.use(globalMiddlewares);

app.use("/capsules", capsulesRouter);

router.get("/", (req, res) => {
  res.render("index", { title: "Time capsules", message: "Landing page 🔮" });
});
