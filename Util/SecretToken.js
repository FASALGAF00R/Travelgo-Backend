// handle generation of token
import env from 'dotenv';
env.config()
import jwt from 'jsonwebtoken'


// passing the payload
export const createSecretToken = (id,userName) => {
  console.log(id,"token");
  return jwt.sign({ id ,userName }, process.env.AXCESSTOKEN_KEY, {
    expiresIn:'10m',
  }); 
};


// // Assigning refresh token in http-only cookie 
// export const Refreshtoken =(id,userName)=>{
//   return jwt.sign({id,userName},process.env.REFRESHTOKEN_KEY,{
//     httpOnly: true,
//     sameSite: 'None', secure: true,
//     expiresIn:'1d',
//   }
    
//     )
// }
