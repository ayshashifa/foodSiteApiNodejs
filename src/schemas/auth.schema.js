const mongoose = require("mongoose");

const authSchema = mongoose.Schema({
    user_id: { type: Number },
    name: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    phone: { type: Number, require: true },
    createdAt: { type: Date, default: Date.now },
    admin: { type: String, default: "false" }

});
module.exports = authSchema;