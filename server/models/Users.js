const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        max:15,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true,
        min:6
    }
},
{timestamps:true}
)

module.exports = mongoose.model("User",usersSchema)