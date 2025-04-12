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
exports.googleSignIn = void 0;
const google_auth_library_1 = require("google-auth-library");
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(400).json({ error: 'Invalid Google token' });
            return;
        }
        const { email, name, sub: googleId } = payload;
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = yield bcryptjs_1.default.hash(randomPassword, 10);
            user = yield User_1.default.create({
                username: (name === null || name === void 0 ? void 0 : name.replace(/\s+/g, '').toLowerCase()) || email.split('@')[0], // Create username from name or email
                email,
                password: hashedPassword,
                googleId,
            });
        }
        const jwtToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.json({
            token: jwtToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Google sign-in error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});
exports.googleSignIn = googleSignIn;
