import mongoose, { Schema, model, Document } from "mongoose";

interface IMilk extends Document {
  cow: mongoose.Schema.Types.ObjectId;
  quantity: number;
  date: Date;
}

const MilkSchema = new Schema<IMilk>({
  cow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cow",
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

export default model<IMilk>("Milk", MilkSchema);