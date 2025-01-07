import { GoogleGenerativeAI } from "@google/generative-ai";
import { webScrapArray } from "../types/types";

const {GEMINI_API} = process.env

class llmResponse{
  private webScrappedData: webScrapArray;
  private query: string;

  constructor(query: string, scrappedData: webScrapArray) {
    this.query = query
    this.webScrappedData = scrappedData;
    // this.llmRequestData(this.webScrappedData);
  }
  public async llmRequestData() {
    try {
      if(!GEMINI_API){
        throw new Error("ENV KEY required")
      }
      const genAI = new GoogleGenerativeAI(GEMINI_API);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `

Given the following query: ${this.query}, analyze the provided web-scraped data: ${this.webScrappedData} and generate a comprehensive response following these guidelines:

1. RESPONSE TYPE DETERMINATION
First, determine the type of query:
- FACTUAL: Direct questions seeking specific information
- ANALYTICAL: Questions requiring analysis or comparison
- INSTRUCTIONAL: How-to queries
- GENERAL: Broad topic exploration
- ERROR: If no relevant data is found

2. RESPONSE STRUCTURE
Based on the query type, generate a response in the following markdown format:

${this.query} if topic === 'GENERAL' ?
# Direct Answer
<Provide a concise, direct answer to the query using the most relevant information>
 :
# Query
${this.query}

## Quick Answer
<2-3 sentence summary answering the core question>

## Detailed Explanation
<Comprehensive explanation structured based on query type:>
- FACTUAL: Present facts with direct citations
- ANALYTICAL: Compare/contrast with supporting evidence
- INSTRUCTIONAL: Step-by-step guide
- GENERAL: Topic overview with key points

## Sources
<List of credible sources with brief context>
- [Source Name](URL) - <One line describing source relevance>

## Additional Context
<If applicable:>
- Related concepts
- Common misconceptions
- Expert opinions
- Recent developments

## Technical Details
<If applicable:>
- Specifications
- Requirements
- Implementation details
- Code examples (in appropriate markdown code blocks)

## Visual Aid
<If beneficial, include ONE of the following:>
- Mermaid diagram for processes/workflows
- Markdown table for comparisons
- ASCII art for simple visualizations
- LaTeX for mathematical expressions

3. QUALITY GUIDELINES
- Ensure all information is from credible sources (\${currentYear} - 3 years when possible)
- Include direct citations for specific claims
- Maintain objective tone
- Prioritize accuracy over comprehensiveness
- Use consistent markdown formatting

4. ERROR HANDLING
If unable to provide accurate information:
- Acknowledge limitations
- Suggest alternative search terms
- Provide general guidance in the domain

5. FORMATTING RULES
- Use proper markdown headers (# for main, ## for sub-sections)
- Format code blocks with language specification
- Use bullet points for lists
- Include line breaks between sections
- Format links as [Text](URL)

6. RESPONSE VALIDATION
Before returning, verify:
- All sources are properly cited
- Markdown syntax is correct
- Information is relevant to query
- Response is well-structured
- No placeholder text remains

7. CONTENT RESTRICTIONS
Do not include:
- Speculative information
- Personal opinions
- Uncited claims
- Redundant information
- External images (use markdown/mermaid diagrams instead)

Example response structure:

# Query
How do neural networks work?

## Quick Answer
Neural networks are computational models inspired by biological brains, using interconnected nodes (neurons) to process information and learn patterns from data.

## Detailed Explanation
1. Basic Structure
- Neural networks consist of layers of neurons ([Source](relevant-url))
- Each neuron processes inputs using weights and biases...

[Rest of the structured response following the format above]



      `;
      const result = await model.generateContent(prompt);
      console.log(result.response.text())
      return result;

    } catch (error) {
        console.log(error)
    }
  }
}

export async function llmGenerateResponse(query: string, results: webScrapArray) {
  const llm = new llmResponse(query, results);
  const llmResponseData = await llm.llmRequestData();
  return llmResponseData;
}