import express from "express";
import {  addCart, getAllproduct, getCart, getOrder, removeCart} from "../controllers/productController";
// import { authenticate } from "../middlewares/auth";
const router=express.Router();


router.get('/all',getAllproduct);
router.post('/addtocart',addCart);
router.post('/removecart',removeCart);
router.post('/getcart',getCart);
router.post('/getorder',getOrder);

export default router;