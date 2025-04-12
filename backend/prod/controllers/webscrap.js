"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.WebScrapController = void 0;
exports.webScrapFromInternet = webScrapFromInternet;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const llmRequest_1 = require("./llmRequest");
class WebScrapController {
    constructor() {
        this.userAgent =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    }
    buildSearchUrl(query) {
        return `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en`;
    }
    fetchHtml(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(url, {
                    headers: {
                        "User-Agent": this.userAgent,
                    },
                });
                return data;
            }
            catch (error) {
                throw new Error("Failed to fetch HTML from the URL.");
            }
        });
    }
    extractResults(html) {
        const $ = cheerio.load(html);
        const results = [];
        $("div.tF2Cxc").each((_index, element) => {
            const title = $(element).find("h3").text();
            const link = $(element).find("a").attr("href") || "";
            const snippet = $(element).find(".VwiC3b").text();
            if (title && link) {
                results.push({ title, link, snippet });
            }
        });
        return results;
    }
    scrapeData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const { query } = req.body;
            if (!query) {
                return res.status(400).json({ error: "Query parameter is required." });
            }
            try {
                const searchUrl = this.buildSearchUrl(query);
                const html = yield this.fetchHtml(searchUrl);
                const results = this.extractResults(html);
                const llmResponse = yield (0, llmRequest_1.llmGenerateResponse)(query, results);
                const result = (_f = (_e = (_d = (_c = (_b = (_a = llmResponse === null || llmResponse === void 0 ? void 0 : llmResponse.response) === null || _a === void 0 ? void 0 : _a.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text;
                // const formatResult = JSON.parse(`"${result}"`).replace(/\\n/g, '\n');
                const formatResult = result === null || result === void 0 ? void 0 : result.replace(/\\n|\\\\n/g, '\n');
                return res.status(200).json({
                    query,
                    result: formatResult
                });
            }
            catch (error) {
                console.error("Error in scrapeData:", error);
                return res.status(500).json({ error: "Failed to scrape data from Google." });
            }
        });
    }
}
exports.WebScrapController = WebScrapController;
function webScrapFromInternet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const webScrapper = new WebScrapController();
        yield webScrapper.scrapeData(req, res);
    });
}
