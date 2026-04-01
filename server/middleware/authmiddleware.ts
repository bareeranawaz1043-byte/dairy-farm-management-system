// middleware/authmiddleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: any;
}

// PROTECT ROUTES
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ADMIN ONLY ROUTES
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only access" });
  }
  next();
};