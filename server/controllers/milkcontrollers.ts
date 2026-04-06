import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Milk from "../models/milk.ts";
import Cow from "../models/cow.ts";

interface IMilkBody {
  cow: string;      
  quantity: number;
  date?: Date;
}


export const createMilk = async (req: Request<{}, {}, IMilkBody>, res: Response, next: NextFunction) => {
  try {
    const { cow, quantity, date } = req.body;

    if (!cow || quantity === undefined) {
      return res.status(400).json({ success: false, message: "Cow and quantity are required" });
    }

    if (quantity < 0) {
      return res.status(400).json({ success: false, message: "Quantity cannot be negative" });
    }

    
    const cowId = new mongoose.Types.ObjectId(cow);

    const cowExists = await Cow.findById(cowId);
    if (!cowExists) return res.status(404).json({ success: false, message: "Cow not found" });

  
    const milk = await new Milk({
      cow: cowId,
      quantity,
      date: date || new Date()
    }).save();

    res.status(201).json({ success: true, message: "Milk entry created", data: milk });
  } catch (error) {
    next(error);
  }
};

export const getMilk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const milkEntries = await Milk.find()
      .populate("cow", "name age breed")
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: milkEntries.length, data: milkEntries });
  } catch (error) {
    next(error);
  }
};

export const getTotalMilk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Milk.aggregate([
      { $group: { _id: null, totalMilk: { $sum: "$quantity" } } }
    ]);

    res.status(200).json({ success: true, totalMilk: result[0]?.totalMilk || 0 });
  } catch (error) {
    next(error);
  }
};

export const getDailyMilk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await Milk.aggregate([
      { $match: { date: { $gte: today } } },
      { $group: { _id: null, dailyMilk: { $sum: "$quantity" } } }
    ]);

    res.status(200).json({ success: true, dailyMilk: result[0]?.dailyMilk || 0 });
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
      { $project: { cowName: "$cowInfo.name", totalMilk: 1 } }
    ]);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};