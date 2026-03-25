import type { Request, Response } from "express";
import Milk from "../models/milk";
import Cow from "../models/cow";

/**
 * Create a new milk entry
 * POST /api/milk
 */
export const createMilk = async (req: Request, res: Response) => {
  try {
    const { cow, quantity, date } = req.body;

    if (!cow || quantity === undefined) {
      return res.status(400).json({ message: "Cow and quantity are required" });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const cowExists = await Cow.findById(cow);
    if (!cowExists) {
      return res.status(404).json({ message: "Cow not found" });
    }

    const milk = await Milk.create({
      cow,
      quantity,
      date: date || new Date(),
    });

    return res.status(201).json(milk);
  } catch (error) {
    console.error("Error creating milk entry:", error);
    return res.status(500).json({ message: "Failed to add milk" });
  }
};

/**
 * Get all milk entries
 * GET /api/milk
 */
export const getMilk = async (req: Request, res: Response) => {
  try {
    const milkEntries = await Milk.find()
      .populate("cow", "name age")
      .sort({ date: -1 });

    return res.status(200).json(milkEntries);
  } catch (error) {
    console.error("Error fetching milk entries:", error);
    return res.status(500).json({ message: "Failed to fetch milk entries" });
  }
};




/**
 * ✅ DAY 7 START
 */

/**
 * Get total milk
 * GET /api/milk/total
 */
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
      totalMilk: result[0]?.totalMilk || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to calculate total milk" });
  }
};

/**
 * Get today's milk
 * GET /api/milk/daily
 */
export const getDailyMilk = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await Milk.aggregate([
      {
        $match: {
          date: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          totalMilk: { $sum: "$quantity" },
        },
      },
    ]);

    res.status(200).json({
      dailyMilk: result[0]?.totalMilk || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to calculate daily milk" });
  }
};

/**
 * Get milk per cow
 * GET /api/milk/per-cow
 */
export const getMilkPerCow = async (req: Request, res: Response) => {
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
      {
        $unwind: "$cowInfo",
      },
      {
        $project: {
          cowName: "$cowInfo.name",
          totalMilk: 1,
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to calculate stats" });
  }
};