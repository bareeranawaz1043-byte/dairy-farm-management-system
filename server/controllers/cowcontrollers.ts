import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Cow from "../models/cow.ts";
import Feeding from "../models/feeding.ts";
import Milk from "../models/milk.ts";

interface ICowBody {
  name: string;
  age: number;
  breed: string;
  milkCapacity: number;
  health?: "healthy" | "sick";
  vaccination?: string;
}

export const createCow = async (req: Request<{}, {}, ICowBody>, res: Response, next: NextFunction) => {
  try {
    const { name, age, breed, milkCapacity, health = "healthy", vaccination } = req.body;
    const cow = await new Cow({ name, age, breed, milkCapacity, health, vaccination }).save();
    res.status(201).json({ success: true, message: "Cow created successfully", data: cow });
  } catch (error) {
    next(error);
  }
};

export const getCows = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cows = await Cow.find();
    res.status(200).json({ success: true, count: cows.length, data: cows });
  } catch (error) {
    next(error);
  }
};

export const updateCow = async (req: Request<{ id: string }, {}, Partial<ICowBody>>, res: Response, next: NextFunction) => {
  try {
    const cow = await Cow.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cow) return res.status(404).json({ success: false, message: "Cow not found" });
    res.status(200).json({ success: true, message: "Cow updated successfully", data: cow });
  } catch (error) {
    next(error);
  }
};

export const getSickCows = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cows = await Cow.find({ health: "sick" });
    res.status(200).json({ success: true, count: cows.length, data: cows });
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cows = await Cow.find({ $or: [{ health: "sick" }, { milkCapacity: { $lt: 10 } }] });
    res.status(200).json({ success: true, count: cows.length, data: cows });
  } catch (error) {
    next(error);
  }
};

export const deleteCow = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const cow = await Cow.findById(req.params.id);
    if (!cow) return res.status(404).json({ success: false, message: "Cow not found" });

    await Feeding.deleteMany({ cow: cow._id });
    await Milk.deleteMany({ cow: cow._id });
    await cow.deleteOne();

    res.status(200).json({ success: true, message: "Cow and related records deleted successfully" });
  } catch (error) {
    next(error);
  }
};