// checks if the user have axcess to the home
const user =require('../Models/Usermodel')
require("dotenv").config();
const jwt = require("jsonwebtoken");
const asyncHandler =require('express-async-handler')



const protect = asyncHandler(async (req, res, next) => {
console.log("protector");
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

      try {

          token = req.headers.authorization.split(" ")[1];
          const decoded = jwt.verify(token, process.env.TOKEN_KEY)
          next();

      } catch (error) {

          res.status(401).json("Invalid token")
      }
  } else {

      res.status(401).json("Token not found")

  }
})

module.exports = { protect }