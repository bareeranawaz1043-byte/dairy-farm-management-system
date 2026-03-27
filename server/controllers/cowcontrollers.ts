import type { Request, Response, NextFunction } from "express";
import Cow from "../models/cow.ts";

interface ICowBody {
  name: string;
  age: number;
  breed: string;
  milkCapacity: number;
}

const createCow = async (req: Request<{}, {}, ICowBody>, res: Response, next: NextFunction) => {
  try {
    const { name, age, breed, milkCapacity } = req.body;

    if (!name || !age || !breed || !milkCapacity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const cow = await Cow.create({ name, age, breed, milkCapacity });

    res.status(201).json({
      success: true,
      message: "Cow created successfully",
      data: cow,
    });
  } catch (error) {
    next(error);
  }
};

const getCows = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cows = await Cow.find();
    res.status(200).json({
      success: true,
      data: cows,
    });
  } catch (error) {
    next(error);
  }
};

const updateCow = async (req: Request<{ id: string }, {}, ICowBody>, res: Response, next: NextFunction) => {
  try {
    const cow = await Cow.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!cow) {
      return res.status(404).json({ message: "Cow not found" });
    }

    res.status(200).json({
      success: true,
      data: cow,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCow = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const cow = await Cow.findByIdAndDelete(req.params.id);

    if (!cow) {
      return res.status(404).json({ message: "Cow not found" });
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getSickCows = async (req: Request, res: Response) => {
  try {
    const cows = await Cow.find({ health: "sick" });
    res.json(cows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sick cows" });
  }
};


const getAlerts = async (req: Request, res: Response) => {
  try {
    const sickCows = await Cow.find({ health: "sick" });

    const alerts = sickCows.map((cow) => ({
      message: `${cow.name} is sick`,
    }));

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching alerts" });
  }
};

export {
  createCow,
  getCows,
  updateCow,
  deleteCow,
  getSickCows,  
  getAlerts,    
};