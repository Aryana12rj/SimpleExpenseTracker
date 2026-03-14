import { GoogleGenAI, Type } from "@google/genai";
import { Expense, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function parseExpenseFromText(text: string): Promise<Partial<Expense> | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract expense details from this text: "${text}". 
      Return a JSON object with amount (number), category (one of: Food, Transport, Bills, Health, Education, Entertainment, Groceries, Other), and description (string).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING, enum: ['Food', 'Transport', 'Bills', 'Health', 'Education', 'Entertainment', 'Groceries', 'Other'] },
            description: { type: Type.STRING }
          },
          required: ["amount", "category", "description"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error parsing expense:", error);
    return null;
  }
}

export async function getFinancialAdvice(expenses: Expense[]): Promise<string> {
  if (expenses.length === 0) return "Add some expenses to get personalized advice!";
  
  const summary = expenses.map(e => `${e.date}: ${e.amount} on ${e.category} (${e.description})`).join("\n");
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Here is a list of my recent expenses:\n${summary}\n\nProvide a short, friendly, and encouraging financial advice (2-3 sentences) suitable for a student or an older person. Focus on one area where they might save or just give a positive reinforcement.`,
    });

    return response.text || "Keep tracking your expenses to stay on top of your finances!";
  } catch (error) {
    console.error("Error getting advice:", error);
    return "Great job tracking your expenses!";
  }
}
