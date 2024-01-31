// handle generation of token
import env from 'dotenv';
env.config()
import jwt from 'jsonwebtoken'


// passing the payload
export const createSecretToken = (id,userName) => {
  return jwt.sign({ id ,userName }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  }); 
};
