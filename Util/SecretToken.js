// handle generation of token
import env from 'dotenv';
env.config()
import jwt from 'jsonwebtoken'



export const createSecretToken = (id) => {
    console.log("ID:", id);
    console.log("TOKEN_KEY:", process.env.TOKEN_KEY);
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
