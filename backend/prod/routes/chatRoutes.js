"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.post('/create', auth_1.default, chatController_1.createChat);
router.post('/message', auth_1.default, chatController_1.sendMessage);
router.get('/list', auth_1.default, chatController_1.getChats);
exports.default = router;
