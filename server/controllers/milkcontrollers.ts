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

    // Validation: cow and quantity are required
    if (!cow || quantity === undefined) {
      return res.status(400).json({ message: "Cow and quantity are required" });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    // Check if cow exists
    const cowExists = await Cow.findById(cow);
    if (!cowExists) {
      return res.status(404).json({ message: "Cow not found" });
    }

    // Create milk entry
    const milk = await Milk.create({ cow, quantity, date });

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
    // Fetch all milk entries and populate cow info
    const milkEntries = await Milk.find().populate("cow", "name age");

    return res.status(200).json(milkEntries);
  } catch (error) {
    console.error("Error fetching milk entries:", error);
    return res.status(500).json({ message: "Failed to fetch milk entries" });
  }
};