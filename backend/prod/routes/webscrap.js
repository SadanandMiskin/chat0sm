"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webscrap_1 = require("../controllers/webscrap");
const router = express_1.default.Router();
router.post('/new-message', (req, res) => {
    (0, webscrap_1.webScrapFromInternet)(req, res);
});
exports.default = router;
