import mongoose from "mongoose";
const productSchema=new mongoose.Schema({
    price:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    isSale:{
        type:Boolean,
        required:true,
    },
    reducedPrice:{
        type:Number,
        required:true,
    },
    color:{
        type:String,
        required:true,
    },
    brandName:{
        type:String,
        required:true,
    },
    productRating:{
        type:Number,
        required:true,
    },
    productDescription:{
        type:String,
        required:true,
    }
})
export const productModel=mongoose.model('product',productSchema);






















// price
// "80"
// description
// "ASOS DESIGN skinny jeans in red croc leather look"
// image
// "images.asos-media.com/products/asos-design-skinny-jeans-in-red-croc-le…"
// isSale
// "TRUE"
// reducedPrice
// "52"
// colour
// "red"
// brandName
// "ASOS DESIGN"
// productRating
// "4.4"
// productDescription
// "Skinny jeans by ASOS DESIGN Next stop: checkoutMock-croc design� Regul…"