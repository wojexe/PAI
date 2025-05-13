import type { ErrorRequestHandler } from "express";

// This middleware catches all unhandled exceptions in route handlers
export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  res.log.error(err, "Unhandled error");

  res.status(500).json({ error: err?.message ?? "Internal server error" });
};
