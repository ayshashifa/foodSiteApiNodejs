const mongoose =require("mongoose");

const loginSchema = mongoose.Schema({
    // name: {
    //     type: String,
    //     required: true
    // },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    otp: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = loginSchema