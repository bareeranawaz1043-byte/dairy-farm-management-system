import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Sale from "../models/sales.ts";
import Cow from "../models/cow.ts";

interface ISaleBody {
  cow: string;
  quantity: number;
  price: number;
  date?: string;
}


export const createSale = async (
  req: Request<{}, {}, ISaleBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cow, quantity, price, date } = req.body;

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

    const cowId = new mongoose.Types.ObjectId(cow);
    const cowExists = await Cow.findById(cowId);
    if (!cowExists) {
      return res.status(404).json({
        success: false,
        message: "Cow not found",
      });
    }

    const total = quantity * price;

    const sale = await Sale.create({
      cow: cowId,
      quantity,
      price,
      total,
      date: date ? new Date(date) : new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Sale created successfully",
      data: sale,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL SALES
export const getSales = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sales = await Sale.find()
      .populate("cow", "name age")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: sales.length,
      data: sales,
    });
  } catch (error) {
    next(error);
  }
};