
import { GoogleGenAI, Type } from "@google/genai";
import { Urgency } from "./types";

export const analyzeComplaint = async (description: string, productName: string, base64Image?: string) => {
  // Use the API key directly from the environment variable as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const parts: any[] = [
      { text: `System: You are an expert Food Quality Control Manager at Berman Bakery (מאפיית ברמן).
      Task: Analyze an internal product quality report. 
      Product: ${productName}
      Complaint: ${description}
      ${base64Image ? "An image is attached. Please check for visual defects like mold, texture issues, or incorrect packaging." : ""}
      
      Requirements:
      1. Summary must be exactly ONE professional sentence in HEBREW.
      2. Urgency must be one of: "נמוכה", "בינונית", "גבוהה", "קריטית".
      3. Categorize precisely (Production, Packaging, Hygiene, etc.).` }
    ];

    if (base64Image) {
      const data = base64Image.split(',')[1];
      parts.push({ inlineData: { mimeType: 'image/jpeg', data } });
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
            summary: { type: Type.STRING },
            visualFindings: { type: Type.STRING, description: "If an image was provided, describe what is seen in Hebrew. Otherwise null." }
          },
          required: ["category", "urgency", "summary"]
        }
      }
    });

    // Access the .text property directly as it is not a method
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      category: "כללי",
      urgency: Urgency.MEDIUM,
      summary: "התלונה נרשמה, אך ניתוח ה-AI לא זמין כרגע."
    };
  }
};
