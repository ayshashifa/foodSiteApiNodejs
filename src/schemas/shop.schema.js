const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    shop_id: Number,
    imagePath: String,
    name: String,
    price: Number,

});
module.exports = shopSchema;
