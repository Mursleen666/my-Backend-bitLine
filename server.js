const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/Mongodb");
const connectcloudinary = require("./config/cloudinary");
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");

let app = express()
app.use(express.json())
app.use(cors())
connectDB()
connectcloudinary()

let Port = process.env.PORT || 4000

app.use("/api/user/",userRouter)
app.use("/api/product/",productRouter)

app.get("/", (req,res)=>{
    res.send("the port is working fine sir!")
})
app.listen(Port, "0.0.0.0", ()=>{console.log("server has started" + Port)})
