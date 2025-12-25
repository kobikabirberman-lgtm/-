import { GoogleGenAI, Type } from "@google/genai";
import { Urgency } from "./types";

export const analyzeComplaint = async (description: string, productName: string, base64Image?: string) => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    throw new Error("מפתח API חסר בשרת. וודא שב-Vercel המשתנה נקרא API_KEY ובצע Redeploy.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const parts: any[] = [
      { text: `System: Expert Food Quality Control at Berman Bakery Israel. 
      Analyze this internal product complaint professionally.
      Answer in HEBREW.
      Product: ${productName}
      User Description: ${description}
      Return JSON only.` }
    ];

    if (base64Image) {
      const data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
      parts.push({
        inlineData: { mimeType: 'image/jpeg', data }
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
            category: { type: Type.STRING, description: "סוג התקלה" },
            urgency: { type: Type.STRING, enum: [Urgency.LOW, Urgency.MEDIUM, Urgency.HIGH, Urgency.CRITICAL] },
            summary: { type: Type.STRING, description: "סיכום הממצאים" },
            visualFindings: { type: Type.STRING, description: "מה רואים בתמונה" }
          },
          required: ["category", "urgency", "summary", "visualFindings"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    throw new Error(error.message || "ניתוח ה-AI נכשל. בדוק חיבור אינטרנט או תקינות מפתח.");
  }
};
