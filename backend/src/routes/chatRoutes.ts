import express from 'express';
import { createChat, sendMessage, getChats, chatName } from '../controllers/chatController';
import auth from '../middleware/auth';
import { register } from 'module';
import { login } from '../controllers/authController';

const router = express.Router();

router.post('/create', auth, createChat);
router.post('/message', auth,  sendMessage);
router.get('/list', auth, getChats);
router.post('/changechat' , auth, chatName)

export default router;
