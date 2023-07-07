import express from "express";

const router=express.Router();

import {userLogin, userRegistration,userInfo, userLogout,sendOtp, forgotPassword, VerifyPassword} from '../controllers/UserController.js';
import { authenticate } from './../middlewares/auth';
import { tokenRefresh, verifyOtp } from './../controllers/UserController';



router.post('/register',userRegistration);
router.post("/login",userLogin);
router.get("/info",authenticate,userInfo);
router.post("/refresh",tokenRefresh);
router.post("/logout",userLogout);
router.post("/reset-password",forgotPassword);
router.post("/verify-password",VerifyPassword);



router.post("/loginwithotp",sendOtp);
router.post("/verifyotp",verifyOtp);

export default router;