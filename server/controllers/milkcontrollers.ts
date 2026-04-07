import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Milk from "../models/milk.ts";
import Cow from "../models/cow.ts";

interface IMilkBody {
  cow: string;
  quantity: number;
  date?: Date | string;
}

export const createMilk = async (req: Request<{}, {}, IMilkBody>, res: Response, next: NextFunction) => {
  try {
    const { cow, quantity, date } = req.body;
    if (!cow || quantity === undefined) return res.status(400).json({ success: false, message: "Cow and quantity required" });
    if (quantity < 0) return res.status(400).json({ success: false, message: "Quantity cannot be negative" });

    const cowId = new mongoose.Types.ObjectId(cow);
    const cowExists = await Cow.findById(cowId);
    if (!cowExists) return res.status(404).json({ success: false, message: "Cow not found" });

    const milk = await Milk.create({ cow: cowId, quantity, date: date ? new Date(date) : new Date() });
    res.status(201).json({ success: true, message: "Milk record created", data: milk });
  } catch (error) {
    next(error);
  }
};

export const getMilk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const milkRecords = await Milk.find().populate("cow", "name age breed");
    res.status(200).json({ success: true, count: milkRecords.length, data: milkRecords });
  } catch (error) {
    next(error);
  }
};

export const getTotalMilk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Milk.aggregate([{ $group: { _id: null, totalMilk: { $sum: "$quantity" } } }]);
    res.status(200).json({ success: true, totalMilk: result[0]?.totalMilk || 0 });
  } catch (error) {
    next(error);
  }
};

export const getDailyMilk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Milk.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          totalMilk: { $sum: "$quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          totalMilk: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getMilkPerCow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Milk.aggregate([
      { $group: { _id: "$cow", totalMilk: { $sum: "$quantity" } } },
      { $lookup: { from: "cows", localField: "_id", foreignField: "_id", as: "cowInfo" } },
      { $unwind: "$cowInfo" },
      { $project: { cowName: "$cowInfo.name", totalMilk: 1 } },
    ]);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};