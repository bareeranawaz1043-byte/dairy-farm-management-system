import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface ISale extends Document {
  cow: Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const saleSchema = new Schema<ISale>(
  {
    cow: {
      type: Schema.Types.ObjectId,
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
  {
    timestamps: true,
  }
);


saleSchema.pre<ISale>("save", function () {
  this.total = this.quantity * this.price;
});

saleSchema.pre("findOneAndUpdate", function () {
  const update: any = this.getUpdate();

  if (update.quantity !== undefined && update.price !== undefined) {
    update.total = update.quantity * update.price;
  }
});

saleSchema.index({ cow: 1 });
saleSchema.index({ date: -1 });

export default model<ISale>("Sale", saleSchema);