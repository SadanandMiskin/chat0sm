import * as cheerio from 'cheerio'
import express from 'express'
import { webScrapFromInternet } from '../controllers/webscrap';

const router = express.Router();

router.post('/new-message' , (req, res)=> {
  webScrapFromInternet(req, res)
})

export default router