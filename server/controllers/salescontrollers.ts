import type { Request, Response } from "express";
import Sale from "../models/sales";
import Cow from "../models/cow";

// CREATE SALE
export const createSale = async (req: Request, res: Response) => {
  try {
    const { cow, quantity, price, date } = req.body;

    // Runtime validation
    if (!cow || quantity === undefined || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Cow, quantity, and price are required",
      });
    }

    if (quantity < 0 || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity and price cannot be negative",
      });
    }

    // Check if cow exists
    const cowExists = await Cow.findById(cow);
    if (!cowExists) {
      return res.status(404).json({
        success: false,
        message: "Cow not found",
      });
    }

    // Create Sale
    const sale = await Sale.create({ cow, quantity, price, date });

    return res.status(201).json({ success: true, data: sale });
  } catch (error) {
    console.error("Error creating sale:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create sale",
    });
  }
};

// GET ALL SALES
export const getSales = async (req: Request, res: Response) => {
  try {
    const sales = await Sale.find().populate("cow", "name age");

    return res.status(200).json({ success: true, data: sales });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sales",
    });
  }
};