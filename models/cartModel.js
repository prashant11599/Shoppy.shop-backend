import mongoose from "mongoose";
const { Schema } = mongoose;
const cartSchema = new Schema({
    cartProducts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    }],
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  },
  { timestamps: true }
);
export const cartModel=mongoose.model("cart", cartSchema);