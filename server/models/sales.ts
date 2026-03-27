import mongoose, { Schema, model, Document } from "mongoose";
export interface ISale extends Document {
  cow: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
  date: Date;
}

const saleSchema = new Schema<ISale>(
  {
    cow: { type: mongoose.Schema.Types.ObjectId, ref: "Cow", required: true },
    quantity: { type: Number, required: true, min: [0, "Quantity cannot be negative"] },
    price: { type: Number, required: true, min: [0, "Price cannot be negative"] },
    total: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

saleSchema.pre("save", function (this: ISale) {
  this.total = this.quantity * this.price;
});

export default model<ISale>("Sale", saleSchema);