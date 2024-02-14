import env from 'dotenv';
env.config()

//  the verify method accepts the token from user and jwtkey and provides decode of the token
console.log("page");
export const userVerification = (req, res, next) => {
  console.log("userverification");
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized token not provided ' })
  }
  try {
    const decoded = jwt.verify(token, process.env.AXCESSTOKEN_KEY)
console.log("vannu");
    const Normaltime = Date.now() / 1000;
    if (decoded.exp < Normaltime) {
      console.log("super");
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



// export const refreshTokenHandler = async (req, res) => {
//   try {
//     const refreshToken = req.body.Refreshtoken;

//     if (!refreshToken) {
//       return res.status(401).json({ success: false, message: 'Unauthorized - Refresh token not provided' });
//     }

//     // Verify the refresh token
//     const decoded = jwt.verify(refreshToken, process.env.REFRESHTOKEN_KEY);

//     // Create a new access token
//     const newAccessToken = jwt.sign({ id: decoded.id, userName: decoded.userName }, process.env.AXCESSTOKEN_KEY, {
//       expiresIn: '10m',
//     });

//     // Send the new access token in the response
//     res.json({ success: true, accessToken: newAccessToken });
//   } catch (error) {
//     res.status(401).json({ success: false, message: 'Unauthorized - Invalid refresh token' });
//   }
// };















