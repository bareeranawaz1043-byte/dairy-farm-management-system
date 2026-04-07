import mongoose, { Schema, model, Document } from "mongoose";

export interface ISale extends Document {
  cow: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
  date: Date;
}

// Sale Schema with validation
const saleSchema = new Schema<ISale>(
  {
    cow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cow",
      required: [true, "Cow reference is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    total: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate total
saleSchema.pre<ISale>("save", function () {
  this.total = this.quantity * this.price;
});

export default model<ISale>("Sale", saleSchema);