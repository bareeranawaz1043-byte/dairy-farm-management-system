import mongoose, { Schema, Document, model } from "mongoose";

interface IFeeding extends Document {
  cow: mongoose.Schema.Types.ObjectId;
  feedType: string;
  quantity: number;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const FeedingSchema = new Schema<IFeeding>(
  {
    cow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cow",
      required: true,
    },
    feedType: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } 
);

export default model<IFeeding>("Feeding", FeedingSchema);