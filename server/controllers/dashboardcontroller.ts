import type { Request, Response } from "express";
import Cow from "../models/cow.ts";
import Milk from "../models/milk.ts";
import Sale from "../models/sales.ts"; 

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
      { $group: { _id: null, totalMilk: { $sum: "$quantity" } } },
    ]);

    res.status(200).json({
      success: true,
      totalMilk: result[0]?.totalMilk || 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching milk total",
    });
  }
};

export const getTotalSales = async (req: Request, res: Response) => {
  try {
    const result = await Sale.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$total" } } },
    ]);

    res.status(200).json({
      success: true,
      totalSales: result[0]?.totalSales || 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sales total",
    });
  }
};

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const sickCows = await Cow.find({ health: "sick" });

    res.status(200).json({
      success: true,
      alerts: sickCows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching alerts",
    });
  }
};

export const getMonthlyReport = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required",
      });
    }

    const start = new Date(`${year}-${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const milkData = await Milk.find({
      date: { $gte: start, $lt: end },
    }).populate("cow", "name");

    const totalQuantity = milkData.reduce(
      (sum, entry) => sum + entry.quantity,
      0
    );

    res.status(200).json({
      success: true,
      totalQuantity,
      entries: milkData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};