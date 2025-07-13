const mongoose = require("mongoose");


const userScheme = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, required: true },
    cartData: { type: Object, default: {} },

    // name: { type: String, default: {} },

}, ({ minimize: false }))

const userModel = mongoose.models.user || mongoose.model("user", userScheme)
module.exports = userModel