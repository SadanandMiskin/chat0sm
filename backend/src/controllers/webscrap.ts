import axios from "axios";
import * as cheerio from "cheerio";
import { Request, Response } from "express";
import { llmGenerateResponse } from "./llmRequest";

export class WebScrapController {
  private readonly userAgent: string;

  constructor() {
    this.userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
  }

  private buildSearchUrl(query: string): string {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en`;
  }

  private async fetchHtml(url: string): Promise<string> {
    try {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent": this.userAgent,
        },
      });
      return data;
    } catch (error) {
      throw new Error("Failed to fetch HTML from the URL.");
    }
  }

  private extractResults(html: string): Array<{ title: string; link: string; snippet: string }> {
    const $ = cheerio.load(html);
    const results: Array<{ title: string; link: string; snippet: string }> = [];

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

  public async scrapeData(req: Request, res: Response): Promise<Response> {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required." });
    }

    try {
      const searchUrl = this.buildSearchUrl(query);
      const html = await this.fetchHtml(searchUrl);
      const results = this.extractResults(html);
      const llmResponse = await llmGenerateResponse(query, results)
      const result = llmResponse?.response?.candidates?.[0]?.content?.parts?.[0]?.text
      // const formatResult = JSON.parse(`"${result}"`).replace(/\\n/g, '\n');
      const formatResult = result?.replace(/\\n|\\\\n/g, '\n');
      return res.status(200).json({
        query,
        result: formatResult
      });
    } catch (error) {
      console.error("Error in scrapeData:", error);
      return res.status(500).json({ error: "Failed to scrape data from Google." });
    }
  }
}

export async function webScrapFromInternet(req: Request, res: Response){
    const webScrapper = new WebScrapController()
    await webScrapper.scrapeData(req, res)
}
