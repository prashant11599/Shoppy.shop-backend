import mongoose from "mongoose";
const { Schema } = mongoose;
const orderSchema = new Schema(
  {
    orderedProducts:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamps: true }
);
export const orderModel = mongoose.model("order", orderSchema);