import Cow from "../models/cow.js";

export const createCow = async (req, res, next) => {
  try {
    const { name, age, breed, milkCapacity } = req.body;
    const cow = await Cow.create({ name, age, breed, milkCapacity });
    res.status(201).json({ success: true, cow });
  } catch (error) {
    next(error);
  }
};