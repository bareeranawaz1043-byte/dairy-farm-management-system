import type { Request, Response } from "express";
import Cow from "../models/cow.ts";
import Milk from "../models/milk.ts";

// Total cows
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

// Total milk
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

// Monthly milk report
export const getMonthlyReport = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) return res.status(400).json({ message: "Month and year required" });

    const start = new Date(`${year}-${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const milkData = await Milk.find(
      { date: { $gte: start, $lt: end } },
      "quantity date cow"
    ).populate("cow", "name");

    const totalQuantity = milkData.reduce((sum, entry) => sum + entry.quantity, 0);

    res.status(200).json({ totalQuantity, entries: milkData });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
};