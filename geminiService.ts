
import { GoogleGenAI, Type } from "@google/genai";
import { Urgency } from "../types";

export const analyzeComplaint = async (description: string, productName: string, base64Image?: string) => {
  // קבלת המפתח מהסביבה של Vercel
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    throw new Error("מפתח API חסר! הגדר API_KEY ב-Settings של Vercel.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const parts: any[] = [
      { text: `System: Expert Food QC at Berman Bakery. 
      Analyze this internal complaint. Provide clear insights in HEBREW.
      Product: ${productName}
      Description: ${description}
      Output JSON only.` }
    ];

    if (base64Image) {
      // הסרת ה-header של ה-base64 אם קיים (data:image/jpeg;base64,...)
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
            category: { type: Type.STRING },
            urgency: { type: Type.STRING, enum: [Urgency.LOW, Urgency.MEDIUM, Urgency.HIGH, Urgency.CRITICAL] },
            summary: { type: Type.STRING }
          },
          required: ["category", "urgency", "summary"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error: any) {
    console.error("AI Error Details:", error);
    if (error.message?.includes("403")) throw new Error("מפתח ה-API לא תקין או שאין לו הרשאות");
    throw new Error("ה-AI לא הצליח לנתח את הדיווח כרגע.");
  }
};
