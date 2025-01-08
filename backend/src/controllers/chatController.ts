import { Request, Response } from 'express';
import Chat from '../models/Chat';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const genAI: any = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model: any = genAI.getGenerativeModel({ model: 'gemini-pro' });


export const createChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const newChat = await Chat.create({
      userId: req?.user?._id,
      title: 'New Chat',
      messages: [],
    });
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatId, message } = req.body;
    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Get Gemini response
    const result = await model.generateContent(message);
    const aiMessage = result?.response?.text();

    if (aiMessage) {
      chat.messages.push({
        role: 'assistant',
        content: aiMessage,
        timestamp: new Date(),
      });
    }

    chat.lastUpdated = new Date();
    await chat.save();

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};


export const getChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const chats = await Chat.find({ userId: req?.user?._id }).sort({
      lastUpdated: -1,
    });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
