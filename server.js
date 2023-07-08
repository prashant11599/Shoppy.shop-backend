import express from 'express';
import { PORT,DB_URL,PAYMENT_API_KEY,PAYMENT_API_SECRET} from './config';
import { dbConnection } from './config/dbConnection';
import user_router from "./routes/user_routes.js";
import product_router from "./routes/product_routes.js";
import payment_router from "./routes/payment_routes.js";
import errorHandler from "./middlewares/errorHandler.js"
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Razorpay from "razorpay";
import mongoose from 'mongoose';
const app=express();

app.use(cors({ 
    origin:['https://shoppy-shop.onrender.com','http://localhost:3000'], 
    methods: ['GET', 'PUT', 'POST'], 
    credentials: true, 
    maxAge: 600, 
    exposedHeaders: ['*', 'Authorization' ] 
}));
export const instance = new Razorpay({
    key_id:PAYMENT_API_KEY ,
    key_secret: PAYMENT_API_SECRET,
});


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


app.use('/api/user',user_router);
app.use('/api/products',product_router);



app.use('/api',payment_router);
app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: PAYMENT_API_KEY })
);
app.use(errorHandler);
dbConnection();
mongoose.connection.once('open',()=>{
    console.log(`connected to db ${DB_URL}`);
    app.listen(PORT,()=>{
        console.log(`app is listening on port ${PORT}`)
    });
})



