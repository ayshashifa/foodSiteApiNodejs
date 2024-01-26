const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    shop_id: Number,
    imagePath: String,
    name: String,
    price: Number,
    largetitle:String,
    content:String,
    

});
module.exports = shopSchema;
