import type { Request, Response, NextFunction } from "express";
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

// Create a new cow
const createCow = async (req: Request<{}, {}, ICowBody>, res: Response, next: NextFunction) => {
  try {
    const { name, age, breed, milkCapacity, health = "healthy", vaccination } = req.body;

    if (!name || !age || !breed || !milkCapacity) {
      return res.status(400).json({
        success: false,
        message: "All required fields (name, age, breed, milkCapacity) must be provided",
      });
    }

    const cow = await Cow.create({ name, age, breed, milkCapacity, health, vaccination });

    res.status(201).json({
      success: true,
      message: "Cow created successfully",
      data: cow,
    });
  } catch (error) {
    next(error);
  }
};

// Get all cows with optional health filter
const getCows = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { health } = req.query;
    const filter: any = {};

    if (health) {
      filter.health = health;
    }

    const cows = await Cow.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: cows.length,
      data: cows,
    });
  } catch (error) {
    next(error);
  }
};

// Update cow by ID
const updateCow = async (req: Request<{ id: string }, {}, ICowBody>, res: Response, next: NextFunction) => {
  try {
    const cow = await Cow.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!cow) {
      return res.status(404).json({ success: false, message: "Cow not found" });
    }

    res.status(200).json({
      success: true,
      message: "Cow updated successfully",
      data: cow,
    });
  } catch (error) {
    next(error);
  }
};

// Delete cow and related feed/milk records
const deleteCow = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const cow = await Cow.findByIdAndDelete(req.params.id);

    if (!cow) {
      return res.status(404).json({ success: false, message: "Cow not found" });
    }

    // Remove related feeding and milk records
    await Feeding.deleteMany({ cow: cow._id });
    await Milk.deleteMany({ cow: cow._id });

    res.status(200).json({ success: true, message: "Cow and related records deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get all sick cows
const getSickCows = async (req: Request, res: Response) => {
  try {
    const sickCows = await Cow.find({ health: "sick" }).sort({ name: 1 });
    res.status(200).json({ success: true, count: sickCows.length, data: sickCows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching sick cows" });
  }
};

// Get alerts for sick cows
const getAlerts = async (req: Request, res: Response) => {
  try {
    const sickCows = await Cow.find({ health: "sick" });
    const alerts = sickCows.map(cow => ({
      cowId: cow._id,
      message: `${cow.name} is sick`,
    }));

    res.status(200).json({ success: true, count: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching alerts" });
  }
};

// Get cow production stats (milk & feed)
const getCowStats = async (req: Request, res: Response) => {
  try {
    const cows = await Cow.find();
    const stats = await Promise.all(
      cows.map(async cow => {
        const totalMilk = await Milk.aggregate([
          { $match: { cow: cow._id } },
          { $group: { _id: null, total: { $sum: "$quantity" } } },
        ]);

        const totalFeed = await Feeding.aggregate([
          { $match: { cow: cow._id } },
          { $group: { _id: null, total: { $sum: "$quantity" } } },
        ]);

        return {
          cowId: cow._id,
          name: cow.name,
          totalMilk: totalMilk[0]?.total || 0,
          totalFeed: totalFeed[0]?.total || 0,
        };
      })
    );

    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch cow stats" });
  }
};

export {
  createCow,
  getCows,
  updateCow,
  deleteCow,
  getSickCows,
  getAlerts,
  getCowStats,
};