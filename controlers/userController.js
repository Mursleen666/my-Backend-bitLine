const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const validator = require("validator");
const bcrypt = require("bcrypt");


let createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}
let loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.json({ success: false, msg: "user not exist" })
        }
        const isMatched = await bcrypt.compare(password, user.password)
        if (isMatched) {
            const token = createToken(user._id)
            return res.json({ success: true, token })
        }
        else {
            return res.json({ success: false, msg: "invaled crendintials" })
        }
    }

    catch (err) {
        return res.send(err)
    }

}

let registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body

        const register = await userModel.findOne({ email })
        if (register) {
            return res.json({ success: false, msg: "user alrealy exist" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, msg: "please write correct Email address" })
        }
        if (!validator.isStrongPassword(password)) {
            return res.json({ success: false, msg: "please choose strong password" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashpass = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashpass

        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.send({ success: true, token })
    } catch (err) {
        res.send(err)
    }

}



const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.PASSWORD) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ success: true, tokens: token });
    } else {
        return res.json({ success: false, msg: "Invalid credentials" });
    }
};



module.exports = {loginAdmin,registerUser,loginUser}