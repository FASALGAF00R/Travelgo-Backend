// checks if the user have axcess to the home
// import {user} from '../Models/Usermodel.js'
import env from 'dotenv';
env.config()
// import jwt from 'jsonwebtoken'
// import asyncHandler from 'express-async-handler'



//  export const protect = asyncHandler(async (req, res, next) => {
// console.log("protector");
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

//       try {

//           token = req.headers.authorization.split(" ")[1];
//           const decoded = jwt.verify(token, process.env.TOKEN_KEY)
//           next();

//       } catch (error) {

//           res.status(401).json("Invalid token")
//       }
//   } else {

//       res.status(401).json("Token not found")

//   }
// })

//  the verify method accepts the token from user and jwtkey and provides decode of the token

export const userVerification = (req, res, next) => {
  console.log("userverification");
  const token = req.headers.authorization.split(' ')[1];
  // Extracts the token from the Authorization header.
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized token not provided ' })
  }
  // decoding of the token
  try {
    // verifying the token
    const decoded = jwt.verify(token, process.env.AXCESSTOKEN_KEY)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Forbidden - Invalid token' });

  }

}














