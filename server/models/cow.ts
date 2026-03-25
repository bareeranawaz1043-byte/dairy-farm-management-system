import mongoose, { Schema, Document, Model } from "mongoose";


export interface ICow extends Document {
  name: string;
  age: number;
  breed: string;
  milkCapacity: number;
  health: "healthy" | "sick";   
  vaccination: string;         
  createdAt?: Date;
  updatedAt?: Date;
}


const cowSchema: Schema<ICow> = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    breed: { type: String, required: true },
    milkCapacity: { type: Number, required: true },


    health: {
      type: String,
      enum: ["healthy", "sick"],
      default: "healthy",
    },
    vaccination: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Cow: Model<ICow> = mongoose.model<ICow>("Cow", cowSchema);

export default Cow;