const { strict } = require("assert");
const mongoose = require("mongoose");

const authSchema = mongoose.Schema({
    user_id:Number,
    name:String,
    email:String,
    pasword:String,
    phone:Number,

});
 module.exports= authSchema;