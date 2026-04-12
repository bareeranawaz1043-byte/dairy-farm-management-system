import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.ts";

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: any;
}

// PROTECT ROUTES
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  try {
    console.log("👉 AUTH HEADER:", req.headers.authorization); // DEBUG

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      console.log("👉 TOKEN RECEIVED:", token); // DEBUG

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      console.log("👉 DECODED:", decoded); // DEBUG

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }
  } catch (error) {
    console.error("❌ TOKEN ERROR:", error);
    return res.status(401).json({ message: "Invalid token" });
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