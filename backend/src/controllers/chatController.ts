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

    const prompt = `Generate a well-structured response to the query below in markdown format, following these guidelines:

    1. **Quick Answer**: Provide a concise 1-2 sentence summary that directly addresses the query.
    2. **Detailed Explanation**: Elaborate with key points, actionable steps, or supporting analysis based on the query type (FACTUAL, ANALYTICAL, INSTRUCTIONAL, or GENERAL). Be precise and avoid unnecessary verbosity.
    3. **Sources and References**: Cite reliable and relevant sources with proper attribution in the format: [Source Name](URL).

    **Note**: Cache the response data to allow for efficient retrieval if the same query or related queries arise in the future.

    **Note**: If the query or message is too generic then just reply it no need for sources and detailed explanation
    **Note**: Don't tell which AI model you are ok.
    # Query
    ${message}
`

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Get Gemini response
    const result = await model.generateContent(prompt);
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
