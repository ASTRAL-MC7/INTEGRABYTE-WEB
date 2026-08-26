import { GoogleGenAI } from "@google/genai";

let genAiClient: GoogleGenAI | null = null;

const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 30;

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAiClient;
}

const SYSTEM_PROMPT = `
You are INGREBYTE BYTEKITCHEN, an ultra-fast AI cooking assistant.
Speed is your #1 priority. Keep all JSON text short, concise, and punchy.

Rules:
1. User provides ingredients (Uzbek, English, Russian, etc.) or cooking questions.
2. Match their language (Uzbek if Uzbek, English if English).
3. Return valid JSON only.
4. For ingredient queries:
   - "bestOption": 1 standout dish with 1 short reason and 1 short tip.
   - "dishes": 2-3 realistic dishes (short taglines, <=15 words).
   - "extraOption": 1 dish with 1-2 missing ingredients.
5. For recipe/how-to queries:
   - "recipeDetail": 3-4 concise numbered steps and 1 short chef tip.
6. For unrelated queries:
   - "intent": "unrelated", 1 short friendly reminder.

JSON Schema:
{
  "intent": "suggestions" | "recipe_detail" | "adaptation" | "unrelated" | "general",
  "language": "uz" | "en" | "ru",
  "summaryMessage": string,
  "detectedIngredients": string[],
  "dishes": [
    {
      "name": string,
      "emoji": string,
      "tagline": string,
      "timeMinutes": number,
      "difficulty": "Easy" | "Medium" | "Quick",
      "matchedIngredients": string[],
      "missingIngredients": string[]
    }
  ],
  "bestOption": {
    "name": string,
    "emoji": string,
    "reason": string,
    "quickTip": string
  },
  "extraOption": {
    "requiredExtras": string,
    "dishName": string,
    "emoji": string,
    "note": string
  },
  "recipeDetail": {
    "dishName": string,
    "emoji": string,
    "timeMinutes": number,
    "servings": string,
    "ingredientsList": string[],
    "steps": string[],
    "chefTip": string
  }
}
`;

const SPEED_PRIORITIZED_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3.7-flash",
];

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const normalizedKey = message.trim().toLowerCase();
    const formattedHistory = Array.isArray(history) ? history.slice(-2) : [];

    if (formattedHistory.length === 0 && queryCache.has(normalizedKey)) {
      const cached = queryCache.get(normalizedKey)!;
      if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return res.status(200).json(cached.data);
      }
    }

    const ai = getGenAI();

    const conversationContents = formattedHistory.map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }],
    }));

    conversationContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    let lastError: any = null;

    for (const model of SPEED_PRIORITIZED_MODELS) {
      try {
        const isLiteOrFlash = model.includes("2.5-flash");
        const response = await ai.models.generateContent({
          model,
          contents: conversationContents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: "application/json",
            temperature: 0.3,
            maxOutputTokens: 800,
            ...(isLiteOrFlash
              ? {
                  thinkingConfig: {
                    thinkingBudget: 0,
                  },
                }
              : {}),
          },
        });

        const text = response.text || "{}";
        try {
          const parsed = JSON.parse(text);
          if (formattedHistory.length === 0) {
            queryCache.set(normalizedKey, { data: parsed, timestamp: Date.now() });
          }
          return res.status(200).json(parsed);
        } catch {
          return res.status(200).json({
            intent: "general",
            summaryMessage: text,
            dishes: [],
          });
        }
      } catch (err: any) {
        console.warn(`Vercel model ${model} failed (${err?.message || err}). Trying next candidate...`);
        lastError = err;
      }
    }

    throw lastError || new Error("All AI models currently unavailable");
  } catch (error: any) {
    console.error("Vercel Gemini API Error:", error);
    return res.status(500).json({
      error: "Failed to process cooking query",
      details: error?.message || "Internal server error",
      fallback: {
        intent: "general",
        summaryMessage: "Something went wrong. Please try again.",
      },
    });
  }
}
