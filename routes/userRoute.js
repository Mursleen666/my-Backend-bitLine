const express = require("express");
const { loginUser, registerUser, loginAdmin } = require("../controlers/userController");

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', loginAdmin)

module.exports = userRouter