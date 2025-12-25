
import { GoogleGenAI, Type } from "@google/genai";
import { Urgency } from "./types";

export const analyzeComplaint = async (description: string, productName: string, base64Image?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const parts: any[] = [
      { text: `מוצר: ${productName}\nתיאור לקוח: ${description}` }
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
        systemInstruction: "אתה מומחה בקרת איכות במאפיית ברמן. נתח את התלונה בעברית. סווג קטגוריה, דחיפות וסיכום.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            urgency: { type: Type.STRING, enum: [Urgency.LOW, Urgency.MEDIUM, Urgency.HIGH, Urgency.CRITICAL] },
            summary: { type: Type.STRING },
            visualFindings: { type: Type.STRING }
          },
          required: ["category", "urgency", "summary", "visualFindings"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("AI Error:", error);
    return null;
  }
};
