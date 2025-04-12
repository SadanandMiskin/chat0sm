"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChats = exports.sendMessage = exports.createChat = void 0;
exports.chatName = chatName;
const Chat_1 = __importDefault(require("../models/Chat"));
const generative_ai_1 = require("@google/generative-ai");
const fireworks_1 = require("@langchain/community/chat_models/fireworks");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newChat = yield Chat_1.default.create({
            userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id,
            title: 'New Chat',
            messages: [],
        });
        res.status(201).json(newChat);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.createChat = createChat;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, message } = req.body;
        const chat = yield Chat_1.default.findById(chatId);
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
`;
        // Add user message
        chat.messages.push({
            role: 'user',
            content: message,
            timestamp: new Date(),
        });
        // Get Gemini response
        // const result = await model.generateContent(systemPrompt);
        // const aiMessage = result?.response?.text();
        const llm = new fireworks_1.ChatFireworks({
            model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
            temperature: 0,
            apiKey: process.env.GEMINI_API_KEY
        });
        const aiMessage = yield llm.invoke([[
                'system', systemPrompt
            ], ['human', message]]);
        // console.log(aiMessage.content)
        if (aiMessage) {
            chat.messages.push({
                role: 'assistant',
                content: (aiMessage.content).toString(),
                timestamp: new Date(),
            });
        }
        chat.lastUpdated = new Date();
        yield chat.save();
        res.json(chat);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.sendMessage = sendMessage;
function chatName(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { chatId, chatTitle } = req.body;
            // console.log(chatTitle)
            const updatedChatName = yield Chat_1.default.findOneAndUpdate({ _id: chatId }, { $set: { title: chatTitle } }, { new: true });
            if (!updatedChatName) {
                res.status(404).json({ error: 'Chat not found' });
                return;
            }
            res.status(200).json({ message: 'Chat title updated successfully', title: updatedChatName.title });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
const getChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const chats = yield Chat_1.default.find({ userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id }).sort({
            lastUpdated: -1,
        });
        res.json(chats);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.getChats = getChats;
