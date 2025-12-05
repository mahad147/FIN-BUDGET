import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Initialize only if key exists to avoid immediate errors, handle checks in methods
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateFinancialInsight = async (
  context: string,
  data: Record<string, any>
): Promise<string> => {
  if (!ai) {
    return "API Key is missing. Please provide a valid API_KEY in the environment variables to use AI features.";
  }

  const prompt = `
    You are a world-class financial advisor. 
    Analyze the following calculation results and provide a brief, actionable insight (max 100 words).
    Use markdown for formatting. Focus on the implications of the numbers.
    
    Context: ${context}
    Data: ${JSON.stringify(data, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insight at this time. Please try again later.";
  }
};