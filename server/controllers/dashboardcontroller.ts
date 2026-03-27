import type { Request, Response } from "express";
import Cow from "../models/cow";

export const getTotalCows = async (req: Request, res: Response) => {
  try {
    const total = await Cow.countDocuments();

    res.status(200).json({
      success: true,
      totalCows: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch total cows",
    });
  }
};