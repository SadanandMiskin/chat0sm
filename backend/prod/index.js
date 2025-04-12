"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import dotenv from 'dotenv';
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
// dotenv.config();
const app = (0, express_1.default)();
(0, db_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
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
app.get('/', (req, res) => {
    res.json({ msg: 'Ok' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
