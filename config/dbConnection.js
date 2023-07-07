import {DB_URL} from './index.js';
import mongoose from 'mongoose';


// connecting to database
 export const dbConnection= async(DB_URL)=>{
     try {
         await mongoose.connect(DB_URL,()=>{
            //  console.log("db connected successfully once again",DB_URL);
         })
     } catch (error) {
        //    console.log(error)    
     }
 }
 
