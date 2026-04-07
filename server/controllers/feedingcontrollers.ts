import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Feeding from "../models/feeding.ts";
import Cow from "../models/cow.ts";

interface IFeedingBody {
  cow: string;
  feedType: string;
  quantity: number;
  date?: Date;
}

export const createFeeding = async (req: Request<{}, {}, IFeedingBody>, res: Response, next: NextFunction) => {
  try {
    const { cow, feedType, quantity, date } = req.body;
    if (!cow || !feedType || quantity === undefined) return res.status(400).json({ success: false, message: "Cow, feed type, quantity required" });
    if (quantity < 0) return res.status(400).json({ success: false, message: "Quantity cannot be negative" });

    const cowId = new mongoose.Types.ObjectId(cow);
    const cowExists = await Cow.findById(cowId);
    if (!cowExists) return res.status(404).json({ success: false, message: "Cow not found" });

    const feed = await Feeding.create({ cow: cowId, feedType, quantity, date: date || new Date() });
    res.status(201).json({ success: true, message: "Feeding entry created", data: feed });
  } catch (error) {
    next(error);
  }
};

export const getFeeding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const feeds = await Feeding.find().populate("cow", "name age breed");
    res.status(200).json({ success: true, count: feeds.length, data: feeds });
  } catch (error) {
    next(error);
  }
};

export const getFeedPerCow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Feeding.aggregate([
      { $group: { _id: "$cow", totalFeed: { $sum: "$quantity" } } },
      { $lookup: { from: "cows", localField: "_id", foreignField: "_id", as: "cowInfo" } },
      { $unwind: "$cowInfo" },
      { $project: { cowName: "$cowInfo.name", totalFeed: 1 } },
    ]);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};