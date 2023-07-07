import { instance } from "../server.js";
import crypto from "crypto";
import { Payment } from "../models/paymentModel.js";
import { PAYMENT_API_SECRET } from "../config/index.js";
import { JWT_SECRET } from "../config/index.js";
import jwt from 'jsonwebtoken';
import { userRegisterModel } from "../models/userModel.js";
import { orderModel } from "../models/orderModel.js";
import Jwtservice from "../utils/jwtService.js";
import CustomErrorHandler from "../utils/customErrorHandler.js";
export const checkout = async (req, res) => {
  const { price } = req.body;
  // const token = req.cookies['jwt_access'];
  // let User;
  // try {
  //   const { _id } = jwt.verify(token,JWT_SECRET);
  //   console.log(_id);
  //   // User = await userRegisterModel.findOne({ _id: _id });
  // } catch (error) {
  //   return next(CustomErrorHandler.unAuthorized());
  // }
  // console.log(token);
  const options = {
    amount: Number(price * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  // const newOrder = new orderModel({ buyer: User });
  // newOrder.products.push(product);
  // newOrder.save();
  // console.log(newOrder);
  res.status(200).json({
    success: true,
    order,
  });
};
export const paymentVerification = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, product, id } =
    req.body;
  // console.log(req.body);
  // const cookie = req.cookies['jwt_refresh'];
  // console.log(cookie);
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", PAYMENT_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
    // Database comes here
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    let User;
    try {
      User = await userRegisterModel.findOne({ _id: id });
    } catch (error) {
      return next(CustomErrorHandler.unAuthorized());
    }
    try {
      // console.log(User);
      const exist = await orderModel.exists({ user: User });
      if (!exist) {
        const newOrder = new orderModel({user:User,orderedProducts:product});
        await newOrder.save();
      } else {
        const newOrder = await orderModel.findOne({ user: User });
        newOrder.orderedProducts.push(product);
        await newOrder.save();
      }
    } catch (error) {
      return next(error)
    }

    // console.log(User);
    // const newOrder = new orderModel({});
    // newOrder.products.push(product);
    // newOrder.buyer=User;
    // newOrder.save();
    // console.log(newOrder);
    res.status(200).send({ "status": "success", "message": "product ordered successfully" });
    // res.redirect(
    //   `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    //   // `http://localhost:3000/profile`
    // );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};

