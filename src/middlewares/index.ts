import express, { type RequestHandler } from "express";
import { loggerMiddleware } from "./logger.js";
import { Config } from "../config/index.js";

const baseUrlMiddleware: RequestHandler = (req, res, next) => {
  res.locals.baseUrl = Config.BASE_PATH;
  next();
};

export const globalMiddlewares = [
  express.static("static"),
  express.static("capsules"),
  express.json(),
  baseUrlMiddleware,
  loggerMiddleware,
];
