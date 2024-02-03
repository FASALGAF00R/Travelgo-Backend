// handle generation of token
import env from 'dotenv';
env.config()
import jwt from 'jsonwebtoken'


// passing the payload
export const createSecretToken = (id,userName) => {
const accesToken =jwt.sign({ id ,userName }, process.env.AXCESSTOKEN_KEY, {
    expiresIn:'3m',
  }); 
// // Assigning refresh token in http-only cookie 
 const Refreshtoken = jwt.sign({id,userName},process.env.REFRESHTOKEN_KEY,{
    // httpOnly: true,
    // sameSite: 'None', secure: true,
    expiresIn:'1d',
  })
  return { accesToken, Refreshtoken };
console.log(accesToken,"accestoken");
console.log(Refreshtoken,"refresh token");
}
