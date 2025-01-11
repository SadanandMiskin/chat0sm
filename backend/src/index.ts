// import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import chatRoutes from './routes/chatRoutes';
import authRoutes from './routes/authRoutes';
import jwt from 'jsonwebtoken'

import { OAuth2Client } from 'google-auth-library'
import User from './models/User';
import { googleSignIn } from './controllers/googleSignin';
// dotenv.config();

const app = express();
connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}
));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
// app.post('/auth/google', googleSignIn);
// const client = new OAuth2Client('963tent.com');

// app.post('/api/auth/google', async (req, res) => {
//   const { credential } = req.body;

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: '963221736370-adpd9i7hsr3sn2f6qhkkctc8j177bghq.apps.googleusercontent.com',  // Ensure this matches your client ID
//     });
//     const payload = ticket.getPayload();

//     // Handle user login/signup with payload info
//     const user = {
//       email: payload?.email,
//       username: payload?.name,
//       // picture: payload?.picture,
//     };

//     // Respond with token or session
//     //  jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
//     const userExists = await User.findOne({email: user.email})


//     if(userExists){
//       const token = jwt.sign({token: userExists?._id},process.env.JWT_SECRET!, { expiresIn: '7d' })
//        res.status(201).json({
//         token,
//         user: {
//           id: userExists._id,
//           username: userExists.username,
//           email: userExists.email,
//         },
//       });
//       return
//     }
//     const googleUser = await User.create({username: user.username, email: user.email})

//     const token = jwt.sign({token: googleUser._id},process.env.JWT_SECRET!, { expiresIn: '7d' })
//      res.status(201).json({
//       token,
//       user: {
//         id: googleUser._id,
//         username: googleUser.username,
//         email: googleUser.email,
//       },
//     });
//   } catch (error) {
//     res.status(400).send('Google login failed');
//   }
// });

app.get('/' , (req,res)=> {
  res.json({msg: 'Ok'})
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
