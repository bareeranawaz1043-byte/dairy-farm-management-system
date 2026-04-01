import type { Request, Response, NextFunction } from "express";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const d = new Date().toISOString();
  console.error(`[${d}] Error on ${req.method} ${req.originalUrl}`);
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
    path: req.originalUrl,
    timestamp: d,
  });
};