const cloudinary = require("cloudinary").v2;

const connectcloudinary = async() =>{
    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_Name,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_SECRET_KEY
    })
    console.log("cloud connecting...")
}

module.exports = connectcloudinary;
