import mongoose, { Schema, Document } from "mongoose";

interface IFeeding extends Document {
  cow: mongoose.Schema.Types.ObjectId;
  feedType: string;
  quantity: number;
  date: Date;
}

const FeedingSchema = new Schema<IFeeding>({
  cow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cow",
    required: true,
  },
  feedType: {
    type: String,
    required: true,
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
});

export default mongoose.model<IFeeding>("Feeding", FeedingSchema);