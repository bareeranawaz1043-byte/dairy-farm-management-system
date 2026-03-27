import type { Request, Response } from "express";
import Feeding from "../models/feeding.ts";
import Cow from "../models/cow.ts";

export const createFeeding = async (req: Request, res: Response) => {
  try {
    const { cow, feedType, quantity, date } = req.body;

    if (!cow || !feedType || quantity === undefined) {
      return res.status(400).json({ message: "Cow, feed type, and quantity are required" });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const cowExists = await Cow.findById(cow);
    if (!cowExists) return res.status(404).json({ message: "Cow not found" });

    const feed = await Feeding.create({ cow, feedType, quantity, date });
    res.status(201).json(feed);
  } catch (error) {
    console.error("Error creating feeding entry:", error);
    res.status(500).json({ message: "Failed to create feeding entry" });
  }
};

export const getFeeding = async (req: Request, res: Response) => {
  try {
    const feeds = await Feeding.find().populate("cow", "name age");
    res.status(200).json(feeds);
  } catch (error) {
    console.error("Error fetching feeding entries:", error);
    res.status(500).json({ message: "Failed to fetch feeding entries" });
  }
};