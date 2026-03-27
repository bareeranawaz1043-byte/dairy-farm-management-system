import type { Request, Response } from "express";
import Sale from "../models/sales";
import Cow from "../models/cow";

// CREATE SALE
export const createSale = async (req: Request, res: Response) => {
  try {
    const { cow, quantity, price, date } = req.body;

    // Validation
    if (!cow || quantity === undefined || price === undefined) {
      return res.status(400).json({
        message: "Cow, quantity and price are required",
      });
    }

    if (quantity < 0 || price < 0) {
      return res.status(400).json({
        message: "Values cannot be negative",
      });
    }

    // Check cow exists
    const cowExists = await Cow.findById(cow);
    if (!cowExists) {
      return res.status(404).json({
        message: "Cow not found",
      });
    }

    const sale = await Sale.create({
      cow,
      quantity,
      price,
      date,
    });

    res.status(201).json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create sale",
    });
  }
};

// GET ALL SALES
export const getSales = async (req: Request, res: Response) => {
  try {
    const sales = await Sale.find().populate("cow", "name");

    res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch sales",
    });
  }
};