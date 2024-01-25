import { user } from '../Models/Usermodel.js'
import { createSecretToken } from '../Util/SecretToken.js'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { sendVerificationEmail } from '../Util/emailService.js'


  function passwordHasher(password){
    const pass = bcrypt.hash(password, 10);
    return pass;
};





// user signup
const verificationToken = crypto.randomBytes(20).toString('hex');



//  user signup
export const loadSignup = async (req, res) => {
    try {
        const User = await user.findOne({ email: req.body.email })
        if (User) {
            return res.json({ message: "user already exisist !" })
        } else {
            const newuser = new user({
                userName: req.body.userName,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password
            })
            newuser.verificationToken = verificationToken;
            newuser.save();
            sendVerificationEmail(newuser);
            const token = createSecretToken(newuser._id);
            res.cookie('tokken', token, {
                withCredentials: true,
                httpOnly: false,
            });
            res.status(201).json({ message: 'User signed up successfully. Please check your email for verification.', success: true, newuser })
        }
    } catch (error) {
        console.error(error);
    }
}



// user email verification

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const Data = await user.findOne({ verificationToken: token });
        if (Data) {
            Data.isVerified = true;
            Data.verificationToken = undefined;
            await Data.save();

            res.json({ message: 'Email verification successful.', Data });
        } else {
            res.status(404).json({ message: 'Invalid or expired verification token.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


// user login

export const loadLogin = async (req, res) => {

    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.json({ message: "All fields are required " })
        }

        const Data = await user.findOne({ email })
        if (!Data) {
            return res.json({ message: "email or password is incorrect" })
        }
        const auth = await bcrypt.compare(password, Data.password);
        if (auth) {
            return res.json({ message: "incorrect password" })
        }
        console.log("7");
        console.log(Data);
        if (Data.isBlock == 'true') {
            const token = createSecretToken(Data._id);
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
            })
            res.status(201).json({ message: "User logged succesfulluy", success: true, Data, token })
        } else {
            res.json({ message: 'users is blocked' })
        }


    } catch (error) {
        console.log(error);
    }


}

// google login 

export const googlelogin = async (req, res) => {
    try {
      
        const { id ,name , email } = req.body.data
        console.log( id ,name , email,"namddddddddddddddddddddddddddde");
        // const Finduser = await user.findOne({ email: email })
        // console.log(Finduser);
            // const hashpass = await passwordHasher(id)

            const Googleuser = new user({
                userName:name,
                email:email,
                password: id
            })

              await Googleuser.save()  
              if(Googleuser){

                  const token = createSecretToken(Googleuser._id);
                  console.log(token,"yyyyy");
                  res.cookie("token", token, {
                      withCredentials: true,
                      httpOnly: false,
                  })
                  res.status(201).json({ message: "User logged succesfulluy", success: true,  token ,Googleuser})         
      
              }        

    } catch (error) {
        console.log(error)
    }
}





