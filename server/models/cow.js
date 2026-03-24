import mongoose from "mongoose";

const cowSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    breed: { type: String, required: true },
    milkCapacity: { type: Number, required: true },
  },
  { timestamps: true }
);

const Cow = mongoose.model("Cow", cowSchema);
export default Cow;