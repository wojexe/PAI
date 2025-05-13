import express from "express";
import { loggerMiddleware } from "./logger.js";

export const globalMiddlewares = [
  express.static("static"),
  express.json(),
  loggerMiddleware,
];
