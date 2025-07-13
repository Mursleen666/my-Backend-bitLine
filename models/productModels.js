const mongoose = require ("mongoose");
const { array } = require("../middleware/multer");

const productScheme = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
   

    sizes: { type: Array, required: true },
    bestSeller: { type: Boolean},
    image: { type: Array, required: true },
    date: { type: Number, required: true }


})

const productModel  = mongoose.models.product || mongoose.model("product", productScheme)
module.exports = productModel