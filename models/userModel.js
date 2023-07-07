import mongoose from 'mongoose';
const userRegisterSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        min:6
    },
    lastName :{
        type:String,
        required:true,
        min:6
    },
    userName:{
        type:String,
        required:true,
        unique:true,
        min:6
    },
    email:{
        type:String,
        required:true,
        unique:true,
        max:40,
        min:5
    },
    phone:{
        type:Number,
        required:true
    },   
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})

const userOtpSchema=new mongoose.Schema({
    phone:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        max:40,
        min:5
    }
})



export const userotpModel=mongoose.model('student_otp',userOtpSchema);
export const userRegisterModel=mongoose.model('student',userRegisterSchema);

