const mongoose = require('mongoose')

const ContactUsSchema = mongoose.Schema({
    user_id:{
        type:Number,
        // default: function() {
        //     return 2000 + mongoose.models['contactUs'].countDocuments();
        //   }
    },
    name:String,
    email:String,
    phone:Number,
    subject:String,
    message:String,
    createdAt:{
        type:Date,
        require:true,
        default:Date.now,
    }

})
module.exports = ContactUsSchema