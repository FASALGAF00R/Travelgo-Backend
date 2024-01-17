// checks if the user have axcess to the home
const user =require('../Models/Usermodel')
require("dotenv").config();
const jwt = require("jsonwebtoken");



module.exports.userVerification = (req, res) => {
  console.log("oooooooooooooooooooooo");
    const token = req.cookies.token
    if (!token) {
      return res.json({ status: false })
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
      if (err) {
       return res.json({ status: false })
      } else {
        const user = await user.findById(data.id)
        if (user)
         return res.json({ status: true, user: user.username })
        else return res.json({ status: false })
      }
    })
  }