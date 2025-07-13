const jwt = require("jsonwebtoken")
const checkToken = async(req, res, next) =>{
 const token = req.header('token');

    if(!token){
      return  res.json({success:false, msg:"Invalid tokens"})
    }
  const token_decode = jwt.verify(token, process.env.JWT_SECRET);

if (token_decode.email !== process.env.ADMIN_EMAIL) {
    return res.json({ success: false, msg: "Invalid Credentials" });
}
    next()

}

module.exports = {checkToken}