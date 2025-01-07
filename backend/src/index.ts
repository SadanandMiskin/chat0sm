import express from "express";
import axios from 'axios'
import cors from 'cors'
import { GenerateContentResponse, GenerateContentResult, GoogleGenerativeAI } from "@google/generative-ai";

import webscrap from './routes/webscrap'

const app = express();
app.use(cors())
app.use(express.json());

app.use('/api' , webscrap)



// const API_KEY = process.env.GEMINI_API
// if (!API_KEY) {
//   throw new Error("GEMINI_API environment variable is not set");
// }
// app.get('/', async (req, res) => {
//   try {
//     // Initialize Google Generative AI client
//     const genAI = new GoogleGenerativeAI( API_KEY);

//     // Choose a model
//     const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Generate content
//     const prompt = "Explain how an LLM works";
//     const response = await model.generateContent(prompt)

//     // Return the result to the client
//     res.json(response);
//   } catch (error) {
//     console.error("Error generating content:", error);
//     res.status(500).json({ error: "An error occurred while generating content." });
//   }
// });



app.listen(3000, () => {
  console.log("Sever Listening");
});
