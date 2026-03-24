import Cow from "../models/cow.js";

const createCow = async (req, res, next) => {
    try {
        const { name, age, breed, milkCapacity } = req.body;
        const cow = await Cow.create({ name, age, breed, milkCapacity });
        res.status(201).json({ success: true, cow });
    } catch (error) {
        next(error);
    }
};
const getCows = async (req, res, next) => {
    try {
        const cows = await Cow.find();
        res.status(200).json({ success: true, cows });
    } catch (error) {
        next(error);
    }
};
const updateCow = async (req, res, next) => {
    try {
        const cow = await Cow.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!cow) {
            return res.status(404).json({ success: false, message: "Cow not found" });
        }
        res.status(200).json({ success: true, cow });
    } catch (error) {
        next(error);
    }
};
const deleteCow = async (req, res, next) => {
    try {
        const cow = await Cow.findByIdAndDelete(req.params.id);
        if (!cow) {
            return res.status(404).json({ success: false, message: "Cow not found" });
        }
        res.status(200).json({ success: true, message: "Cow deleted successfully" });
    } catch (error) {
        next(error);
    }
};
export { createCow, getCows, updateCow, deleteCow };