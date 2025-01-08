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
const Chat_1 = __importDefault(require("../models/Chat"));
const generative_ai_1 = require("@google/generative-ai");
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
    var _a;
    try {
        const { chatId, message } = req.body;
        // const chat = await Chat.findById(chatId);
        // if (!chat) {
        //   res.status(404).json({ error: 'Chat not found' });
        //   return;
        // }
        // Add user message
        // chat.messages.push({
        //   role: 'user',
        //   content: message,
        //   timestamp: new Date(),
        // });
        // Get Gemini response
        const result = yield model.generateContent(message);
        const aiMessage = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.text();
        if (aiMessage) {
            // chat.messages.push({
            //   role: 'assistant',
            //   content: aiMessage,
            //   timestamp: new Date(),
            // });
        }
        // chat.lastUpdated = new Date();
        // await chat.save();
        res.json(aiMessage);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.sendMessage = sendMessage;
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
