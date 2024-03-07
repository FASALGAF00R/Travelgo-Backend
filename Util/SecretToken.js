// handle generation of token
import env from 'dotenv';
env.config()
import jwt from 'jsonwebtoken'


// passing the payload
export const createSecretToken = (id,userName,email) => {
const accesToken =jwt.sign({ id ,userName,email }, process.env.AXCESSTOKEN_KEY, {
    expiresIn:'24h',
  }); 
  
 const Refreshtoken = jwt.sign({id,userName,email},process.env.REFRESHTOKEN_KEY,{
    expiresIn:'2d',
  })
  return { accesToken, Refreshtoken };
}
