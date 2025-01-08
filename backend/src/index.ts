// import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import chatRoutes from './routes/chatRoutes';
import authRoutes from './routes/authRoutes';


// dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
