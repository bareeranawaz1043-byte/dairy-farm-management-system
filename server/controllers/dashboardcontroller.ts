import type { Request, Response } from "express";
import Cow from "../models/cow.ts";
import Milk from "../models/milk.ts";

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

export const getTotalMilk = async (req: Request, res: Response) => {
  try {
    const result = await Milk.aggregate([
      {
        $group: {
          _id: null,
          totalMilk: { $sum: "$quantity" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      totalMilk: result[0]?.totalMilk || 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching milk total" });
  }
};