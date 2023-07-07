import CustomErrorHandler from "../utils/customErrorHandler";
import { userRegisterModel } from "../models/userModel";
import { productModel } from '../models/productModel.js';
import { cartModel } from "../models/cartModel";
import { orderModel } from "../models/orderModel";
import mongoose from "mongoose";
// // import CustomErrorHandler from "../utils/customErrorHandler";
// import { REFRESH_JWT_SECRET } from "../config";

// import Jwtservice from "../utils/jwtService";
export const getAllproduct = async (req, res, next) => {
    let data, page, limit, skip, total;
    try {
        page = req.query.page ? parseInt(req.query.page) : 1;
        limit = req.query.limit ? parseInt(req.query.limit) : 12;
        skip = (page - 1) * limit;
        total = await productModel.countDocuments();
        // console.log(page);
        data = await productModel.find().skip(skip).limit(limit);
        // res.status(200).json(data);
        // console.log(data);
    } catch (error) {
        // console.log(error);
        return next(CustomErrorHandler.serverError())
    }
    res.status(200).json({ records: data, total });
}

export const addCart = async (req, res, next) => {
    const { product, id } = req.body;
    // console.log(req.body);
    let User;
    try {
        User = await userRegisterModel.findOne({ _id: id });
    } catch (error) {
        return next(CustomErrorHandler.unAuthorized());
    }
    try{
        const toadd=await cartModel.findOne({user:User}).populate({
            path:'cartProducts',
            match:{_id:{$eq:product._id}},
            select:'_id'
        }).exec();
        // console.log(toadd.cartProducts.length);
        if(toadd.cartProducts.length===1){
            return next(CustomErrorHandler.alreadyExist('product already in the cart'));
        }
        const exist = await cartModel.exists({ user: User });
        if (!exist) {
            const newCart = new cartModel({ user: User, cartProducts: product });
            await newCart.save();
        } else {
            const newCart = await cartModel.findOne({ user: User });
            newCart.cartProducts.push(product);
            await newCart.save();
        }

    } catch (error) {
        // console.log(error);
        return next(error)
    }
    res.status(200).send({ "status": "success", "message": "Product added to cart Successfully" });
}
export const removeCart=async(req,res,next)=>{
    const {productId,id}=req.body;
    // console.log(req.body);
    let User;
    try {
        User = await userRegisterModel.findOne({ _id: id });
    } catch (error) {
        return next(CustomErrorHandler.unAuthorized());
    }
    let cartdata,total;
    try {
        await cartModel.findOneAndUpdate({user:User},{$pull: {cartProducts:productId}});
        const data= await cartModel.findOne({user:User}).populate("cartProducts");
        cartdata=data.cartProducts;
        total=data.cartProducts.length;
    } catch (error) {
        return next(error);
    }
    res.status(200).json({cartdata, total});
}
export const getCart = async (req, res, next) => {
    const { id } = req.body;
    let User;
    try {
        User = await userRegisterModel.findOne({ _id: id });
    } catch (error) {
        return next(CustomErrorHandler.unAuthorized());
    }
    // console.log(User);
    let cartdata,total;
    try {
        const data= await cartModel.findOne({ user: User }).populate("cartProducts").sort("createdAt:-1");
        cartdata=data.cartProducts;
        total=data.cartProducts.length;
        // console.log(data.cartProducts.length);
    } catch (error) {
        return next(error);
    }
    res.status(200).json({cartdata, total});
}

export const getOrder=async(req,res,next)=>{
    const { id } = req.body;
    let User;
    try {
        User = await userRegisterModel.findOne({ _id: id });
    } catch (error) {
        return next(CustomErrorHandler.unAuthorized());
    }
    let orderdata,total;
    try {
        const data= await orderModel.findOne({ user: User }).populate("orderedProducts");
        orderdata=data.orderedProducts;
        total=data.orderedProducts.length;
        // console.log(data);
    } catch (error) {
        return next(error);
    }
    res.status(200).json({orderdata,paymentStatus:"success",total});
}