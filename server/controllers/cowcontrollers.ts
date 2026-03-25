import type { Request, Response, NextFunction } from "express";
import Cow from "../models/cow.ts";

interface ICowBody {
    name: string;
    age: number;
    breed: string;
    milkCapacity: number;
}

// CREATE Cow
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

// GET all cows
const getCows = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cows = await Cow.find();
        res.status(200).json({
            success: true,
            message: "Cows fetched successfully",
            data: cows,
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE Cow
const updateCow = async (req: Request<{ id: string }, {}, ICowBody>, res: Response, next: NextFunction) => {
    try {
        const { name, age, breed, milkCapacity } = req.body;

        if (!name || !age || !breed || !milkCapacity) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const cow = await Cow.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!cow) {
            return res.status(404).json({
                success: false,
                message: "Cow not found",
            });
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

// DELETE Cow
const deleteCow = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const cow = await Cow.findByIdAndDelete(req.params.id);

        if (!cow) {
            return res.status(404).json({
                success: false,
                message: "Cow not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Cow deleted successfully",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

export { createCow, getCows, updateCow, deleteCow };