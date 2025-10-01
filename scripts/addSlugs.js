const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productModel = require("../models/productModels");

dotenv.config(); // load .env

const slugify = (text) =>
  text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const products = await productModel.find({ $or: [{ slug: { $exists: false } }, { slug: "" }] });

    for (let product of products) {
      product.slug = slugify(product.name);
      await product.save();
      console.log(`✅ Added slug for ${product.name}`);
    }

    console.log("🎉 Done updating slugs!");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

run();
