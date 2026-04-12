import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Milk from "../models/milk.ts";
import Cow from "../models/cow.ts";

interface IMilkBody {
  cow: string;
  quantity: number;
  date?: Date | string;
}

/* ---------------- CREATE MILK ---------------- */
export const createMilk = async (
  req: Request<{}, {}, IMilkBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cow, quantity, date } = req.body;

    if (!cow || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Cow and quantity required",
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }

    const cowId = new mongoose.Types.ObjectId(cow);

    const cowExists = await Cow.findById(cowId);
    if (!cowExists) {
      return res.status(404).json({
        success: false,
        message: "Cow not found",
      });
    }

    const milk = await Milk.create({
      cow: cowId,
      quantity,
      date: date ? new Date(date) : new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Milk record created",
      data: milk,
    });
  } catch (error) {
    next(error);
  }
};

/* ---------------- GET ALL MILK ---------------- */
export const getMilk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const milkRecords = await Milk.find()
      .populate("cow", "name age breed")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: milkRecords.length,
      data: milkRecords,
    });
  } catch (error) {
    next(error);
  }
};

/* ---------------- TOTAL MILK ---------------- */
export const getTotalMilk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await Milk.aggregate([
      {
        $group: {
          _id: null,
          totalMilk: { $sum: "$quantity" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      totalMilk: result[0]?.totalMilk || 0,
    });
  } catch (error) {
    next(error);
  }
};

/* ---------------- DAILY MILK (FIXED) ---------------- */
export const getDailyMilk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const result = await Milk.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          dailyMilk: { $sum: "$quantity" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      dailyMilk: result[0]?.dailyMilk || 0,
    });
  } catch (error) {
    next(error);
  }
};

/* ---------------- MILK PER COW ---------------- */
export const getMilkPerCow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await Milk.aggregate([
      {
        $group: {
          _id: "$cow",
          totalMilk: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "cows",
          localField: "_id",
          foreignField: "_id",
          as: "cowInfo",
        },
      },
      { $unwind: "$cowInfo" },
      {
        $project: {
          cowName: "$cowInfo.name",
          totalMilk: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};