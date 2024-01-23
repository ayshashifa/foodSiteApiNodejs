const mongoose = require('mongoose');
const newsSchema = mongoose.Schema({
    news_id:Number,
    fileName:String,
    url:String,
    title:String,
    admin:String,
    publishedDate:Date,
    content:String,
    largeContent:String,
    innerTitle:String,
    recentPosts:String,
    tags:String,
    comments:[{
        profile:String,
        name:String,
        date:Date,
        commentCustomer:String,
    }]
});
module.exports = newsSchema;

