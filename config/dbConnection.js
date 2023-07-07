import {DB_URL} from './index.js';
import mongoose from 'mongoose';

// connecting to database
 export const dbConnection= async () =>{
     try {
        await mongoose.connect(DB_URL,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
         });
     } catch (error) {
           console.log(error)    
     }
 }
 
