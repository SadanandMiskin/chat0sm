import express from 'express';
import { createChat, sendMessage, getChats } from '../controllers/chatController';
import auth from '../middleware/auth';
import { register } from 'module';
import { login } from '../controllers/authController';

const router = express.Router();

router.post('/create', auth, createChat);
router.post('/message', auth,  sendMessage);
router.get('/list', auth, getChats);


export default router;
