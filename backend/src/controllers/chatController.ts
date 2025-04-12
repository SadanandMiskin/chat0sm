import { Request, Response } from 'express';
import Chat from '../models/Chat';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import {ChatFireworks} from '@langchain/community/chat_models/fireworks'

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
    // console.log(message, chat)

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    const systemPrompt = ` Your name is Chat0sm. and you are a good assistance who answer questions,  Answer the following query using this structure:

    If a question is too general then answer in general without any quick answer, detailed or sources. Or:
Quick Answer: A short 1–2 sentence response.

Detailed Explanation: A clear, well-structured, and actionable breakdown based on the query type (FACTUAL, ANALYTICAL, INSTRUCTIONAL, or GENERAL).

Sources and References: Add reliable and relevant links in the format Source Name.

Only include sources if the query is not too generic. Cache the response for future similar queries.
`

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Get Gemini response
    // const result = await model.generateContent(systemPrompt);
    // const aiMessage = result?.response?.text();
    const llm = new ChatFireworks({
      model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
      temperature: 0,
      apiKey: process.env.GEMINI_API_KEY
    })
    const aiMessage = await llm.invoke([[
      'system', systemPrompt
    ], ['human' ,message]])

    // console.log(aiMessage.content)
    if (aiMessage) {
      chat.messages.push({
        role: 'assistant',
        content: (aiMessage.content).toString(),
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



export async function chatName(req: Request, res: Response): Promise<void> {
  try {
    const { chatId, chatTitle } = req.body;
    // console.log(chatTitle)
    const updatedChatName = await Chat.findOneAndUpdate({ _id: chatId }, { $set: { title: chatTitle } }, { new: true });
    if (!updatedChatName) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }
    res.status(200).json({ message: 'Chat title updated successfully', title: updatedChatName.title });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

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
