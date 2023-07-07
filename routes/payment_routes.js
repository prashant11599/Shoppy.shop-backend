import express from "express";
import {
  checkout,
  paymentVerification,
} from "../controllers/paymentController.js";
// import { authenticate } from "../middlewares/auth.js";
const router = express.Router();
router.route("/checkout").post(checkout);
// router.post("/checkout",authenticate,checkout);
router.route("/paymentverification").post(paymentVerification);

export default router;