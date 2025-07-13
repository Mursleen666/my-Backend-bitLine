const cloudinary = require("cloudinary").v2;
const { response } = require("express");
const productModel = require("../models/productModels.js")

const addProduct = async(req, res) =>{
    try{
   const {name, description, price, image, category, subCategory, sizes, bestSeller} = req.body
   const image1 = req.files.image1 && req.files.image1[0]
   const image2 = req.files.image2 && req.files.image2[0]
   const image3 = req.files.image3 && req.files.image3[0]
   const image4 = req.files.image4 && req.files.image4[0]
   const imgArr = [image1,image2,image3,image4]
   
   const images = imgArr.filter((m)=>m!==undefined)

   const imageUrl = await Promise.all(
        images.map(async (items) =>{                                                                           
            let result = cloudinary.uploader.upload(items.path, {resource_type:"image"})
            return (await result).secure_url
        } )
   )
   const parsedSizes = sizes ? JSON.parse(sizes) : [];
   const productData = {
    name, description, price: Number(price), category, subCategory, sizes:parsedSizes, bestSeller:bestSeller === "true"?true:false ,image: imageUrl, date:Date.now()
   }

   const myProduct = new productModel(productData)
   myProduct.save().then(()=>{res.send({success:true, message:"Data save successfully"})})
  
  // const data = await 

   console.log(name, description, price, image, category, subCategory, sizes, bestSeller);
   console.log(image1,image2,image3,image4);
   
    }
   catch(err){
    res.send({success:false, msg:err,})
    console.log(err)
   }

}

const listProduct = async(req, res) =>{
    const product = await productModel.find().lean({})
    res.status(200).json({success:true, data:product})
}

const removeProduct = async(req, res) =>{
    const delProduct = await productModel.findByIdAndDelete(req.body.id)
    res.status(200).json({success:true, response:delProduct})
}

const singleProduct = async(req, res) =>{
    const singProduct = await productModel.findById(req.body.id)
    res.status(200).json({success:true, singProduct})
}

module.exports = {addProduct, removeProduct, listProduct, singleProduct}