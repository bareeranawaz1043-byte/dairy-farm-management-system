import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICow extends Document {
  name: string;
  age: number;
  breed: string;
  milkCapacity: number;
  health: "healthy" | "sick";
  vaccination?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const cowSchema: Schema<ICow> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: [0, "Age must be greater than 0"],
    },

    breed: {
      type: String,
      required: true,
      trim: true,
    },

    milkCapacity: {
      type: Number,
      required: true,
      min: [0, "Milk capacity must be greater than 0"],
    },

    health: {
      type: String,
      enum: ["healthy", "sick"],
      default: "healthy",
    },

    vaccination: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
cowSchema.index({ name: 1 });

const Cow: Model<ICow> = mongoose.model<ICow>("Cow", cowSchema);

export default Cow;