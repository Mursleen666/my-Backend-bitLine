const mongoose = require("mongoose");

const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("db connected");
    })

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });


    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`)
}

module.exports = connectDB;