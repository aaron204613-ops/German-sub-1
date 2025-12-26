import { GoogleGenAI, Type } from "@google/genai";
import { VerbData } from "../types";

export const fetchVerbConjugations = async (verbString: string): Promise<VerbData[]> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found. Returning mock data would happen here in a real app, but throwing error to enforce key usage.");
    throw new Error("Missing API Key");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are a German language expert.
    I have a list of German verbs: "${verbString}".
    
    Please convert this list into a structured JSON array.
    For each verb, provide:
    1. The infinitive (as provided, but corrected if there are typos).
    2. The correct auxiliary verb for Partizip II (Perfekt) - strictly 'hat' or 'ist'.
    3. The Partizip II form (e.g., 'geschlafen').
    4. The Chinese translation (meaning).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              infinitive: { type: Type.STRING },
              auxiliary: { type: Type.STRING, enum: ['hat', 'ist'] },
              participle: { type: Type.STRING },
              chinese: { type: Type.STRING }
            },
            required: ['infinitive', 'auxiliary', 'participle', 'chinese']
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from AI");
    }

    const data = JSON.parse(jsonText) as VerbData[];
    return data;
  } catch (error) {
    console.error("Failed to fetch verb data:", error);
    throw error;
  }
};