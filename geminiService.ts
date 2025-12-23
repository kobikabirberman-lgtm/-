import { GoogleGenAI, Type } from "@google/genai";
import { Urgency } from "./types";

export const analyzeComplaint = async (description: string, productName: string, base64Image?: string) => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined") {
    throw new Error("מפתח API לא הוגדר ב-Vercel. יש להוסיף API_KEY ב-Settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const parts: any[] = [
      { text: `System: Expert Food Quality Control at Berman Bakery. 
      Analyze this product complaint. Be concise. Answer in HEBREW.
      Product: ${productName}
      Description: ${description}
      Return JSON only.` }
    ];

    if (base64Image) {
      const data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "סוג התקלה במילה אחת" },
            urgency: { type: Type.STRING, enum: [Urgency.LOW, Urgency.MEDIUM, Urgency.HIGH, Urgency.CRITICAL] },
            summary: { type: Type.STRING, description: "סיכום הממצאים ב-10 מילים" }
          },
          required: ["category", "urgency", "summary"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error("ה-AI נתקל בשגיאה. בדוק את מפתח ה-API ב-Vercel.");
  }
};
