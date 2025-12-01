import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the client
const getAIClient = () => {
  if (!apiKey) {
    console.error("Gemini API key not found. Please set VITE_GEMINI_API_KEY.");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateContent = async (
  prompt: string,
  systemInstruction: string = "You are a helpful expert tutor for A-Level ICT."
): Promise<string> => {
  try {
    const ai = getAIClient();

    // Using gemini-2.5-flash as recommended for text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Balance creativity and accuracy
        topP: 0.95,
        topK: 40,
      }
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error("No content generated.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const getEmbeddings = async (text: string): Promise<number[]> => {
  try {
    const ai = getAIClient();
    const result = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: text,
    });

    if (result.embedding?.values) {
      return result.embedding.values;
    }
    // Fallback for different SDK versions or response formats
    if (result.embeddings && result.embeddings.length > 0) {
      return result.embeddings[0].values;
    }
    throw new Error("No embedding returned");
  } catch (error) {
    console.error("Embedding Error:", error);
    throw error;
  }
};