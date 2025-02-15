import env from 'dotenv';
import jwt from 'jsonwebtoken';

env.config()

export const userVerification = (req, res, next) => {
  const axcesstoken = req.headers.authorization.split(' ')[1];

  if (!axcesstoken) {
    return res.status(401).json({ success: false, message: 'Unauthorized token not provided ' })
  }
  try {
  const decoded =  jwt.verify(axcesstoken, process.env.AXCESSTOKEN_KEY);
    const Normaltime = Date.now() / 1000;
    if (decoded.exp < Normaltime) {
      return res.status(401).json({ message: 'token has expired' })
    }
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Forbidden - Token has expired' });
    }

    return res.status(401).json({ message: 'Forbidden - Invalid token' });

  }

}


















