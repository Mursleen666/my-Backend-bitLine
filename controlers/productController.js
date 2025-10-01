const cloudinary = require("cloudinary").v2;
const NodeCache = require("node-cache");
const productModel = require("../models/productModels.js");

const productCache = new NodeCache({ stdTTL: 60 }); // Cache for 60s

const addProduct = async (req, res) => {

  const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")       // spaces → -
    .replace(/[^\w\-]+/g, "")   // remove non-word chars
    .replace(/\-\-+/g, "-");    // collapse multiple dashes
};

  try {
    const { name, description, price, image, category, subCategory, sizes, bestSeller } = req.body;

    const image1 = req.files.image1?.[0];
    const image2 = req.files.image2?.[0];
    const image3 = req.files.image3?.[0];
    const image4 = req.files.image4?.[0];
    const imgArr = [image1, image2, image3, image4].filter(Boolean);

    const imageUrl = await Promise.all(
      imgArr.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    const parsedSizes = sizes ? JSON.parse(sizes) : [];

    const slug = slugify(name);


    const productData = {
      name,
      slug,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: parsedSizes,
      bestSeller: bestSeller === "true",
      image: imageUrl,
      date: Date.now()
    };

    await new productModel(productData).save();

    // Invalidate cache after adding
    productCache.flushAll();

    res.send({ success: true, message: "Product saved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, msg: err.message });
  }
};

const listProduct = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query; // defaults: page=1, limit=10
    page = parseInt(page);
    limit = parseInt(limit);

    const cacheKey = `products-page-${page}-limit-${limit}`;

    // Check cache
    const cached = productCache.get(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, ...cached });
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      productModel.find().skip(skip).limit(limit).lean(),
      productModel.countDocuments()
    ]);

    const result = {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };

    // Save to cache
    productCache.set(cacheKey, result);

    res.status(200).json({ success: true, ...result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message });
  }
};


const removeProduct = async (req, res) => {
  try {
    const delProduct = await productModel.findByIdAndDelete(req.body.id);
    productCache.flushAll(); // Invalidate cache
    res.status(200).json({ success: true, response: delProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message });
  }
};


module.exports = { addProduct, removeProduct, listProduct, singleProduct };
