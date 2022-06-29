const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema({
    Username : {
        type:String,
        required:true,
        max:15
    },
    Title:{
        type:String,
        required:true,
        unique:true
    },
    desc:{
        type:String,
        required:true,
        min:6
    },
    rating:{
        type:Number,
        min:0,
        max:5

    },
    lat:{
        type:Number,
        required:true
    },
    long:{
        type:Number,
        required:true
    }
},
{timestamps:true}
)

module.exports = mongoose.model("Pin",PinSchema)