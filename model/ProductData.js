const mongoose = require('mongoose');
const ProductData = new mongoose.Schema({
    name:{
        type:String,
        requires:true
    },
    category:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    images:{
        type:Array,
    }
})

const product=mongoose.model('product',ProductData);
module.exports=product;