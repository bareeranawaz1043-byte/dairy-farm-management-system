import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for a Cow document
export interface ICow extends Document {
  name: string;
  age: number;
  breed: string;
  milkCapacity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Cow schema
const cowSchema: Schema<ICow> = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    breed: { type: String, required: true },
    milkCapacity: { type: Number, required: true },
  },
  { timestamps: true }
);

// Cow model
const Cow: Model<ICow> = mongoose.model < ICow > ("Cow", cowSchema);

export default Cow;