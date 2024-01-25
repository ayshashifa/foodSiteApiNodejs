const mongoose = require('mongoose');
const commentSchema = mongoose.Schema({
    name:String,
    email:String,
    comment:String,
    news_id:Number,
    createdAt:{ type: Date, required: true, default: Date.now }
    // commentId:Number,
});

module.exports = commentSchema;
