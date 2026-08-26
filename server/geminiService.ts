import { GoogleGenAI } from "@google/genai";

let genAiClient: GoogleGenAI | null = null;

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
You are INGREBYTE BYTEKITCHEN, an ultra-fast, minimalist AI cooking assistant designed for mobile & Telegram Mini App.
Your mission:
1. The user will list ingredients they currently have (in Uzbek, English, Russian, or any language).
   Examples:
   - "Menda tuxum, pomidor, piyoz va kartoshka bor."
   - "tuxum + pomidor + piyoz"
   - "I have eggs, tomatoes, onions and cheese."
   - "Menda chicken, rice and eggs bor."
2. You output structured JSON matching the AssistantResponse schema.
3. If the user input is a list of ingredients:
   - Identify 2-4 realistic, delicious dishes they can prepare right now using mainly what they have.
   - Choose exactly one standout "bestOption" with a snappy reason ("Best match for what you already have" / "Masalliqlaringizga eng mos keluvchi tanlov").
   - Suggest 1 "extraOption" ("With a few extra ingredients..." / "Qo'shimcha bir-ikki mahsulot bilan...") e.g. "Chicken + rice → Fried Rice would also be a great option."
   - Keep descriptions short, snappy, and mouth-watering.
4. If the user asks for a recipe or follow-up (e.g., "Birinchisini qanday qilaman?", "How do I make Shakshuka?", "Piyoz yo'q ekan, qanday almashtiraman?"):
   - intent: "recipe_detail" or "adaptation"
   - Provide concise, numbered, easy-to-follow cooking steps (no wall of text!).
   - Include prep time, ingredients list, and a smart chef tip.
5. If the user writes something completely unrelated to cooking/ingredients:
   - intent: "unrelated"
   - summaryMessage: "I’m here to help you figure out what to cook. Tell me what ingredients you have." (translated naturally to the language the user used).
6. LANGUAGE ADAPTATION:
   - Always respond in the SAME language the user writes in (Uzbek, English, Russian, etc.).
   - If user wrote in Uzbek, all dish taglines, reasons, and steps must be in natural, modern Uzbek.
   - If in English, in clean English.

JSON Schema format to return:
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

// Candidate models in order of priority & speed with automatic failover
const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-3.7-flash",
  "gemini-2.5-flash-lite",
];

export async function processCookingQuery(
  history: Array<{ role: 'user' | 'model'; text: string }>,
  latestMessage: string
) {
  const ai = getGenAI();

  const recentHistory = history.slice(-4);
  const conversationContents = recentHistory.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.text }],
  }));

  conversationContents.push({
    role: 'user',
    parts: [{ text: latestMessage }],
  });

  let lastError: any = null;

  // Try candidate models in order to handle 503 high demand seamlessly
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: conversationContents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });

      const text = response.text || "";
      if (text) {
        try {
          const parsed = JSON.parse(text);
          return parsed;
        } catch {
          return {
            intent: "general",
            summaryMessage: text || "Mana sizning masalliqlaringiz uchun takliflar.",
            dishes: [],
          };
        }
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed (${err?.message || err}). Trying next fallback...`);
      lastError = err;
      // Continue to next candidate model
    }
  }

  // If all models failed or encountered 503, throw or return graceful structured fallback
  console.error("All Gemini candidate models failed:", lastError);
  throw lastError || new Error("All AI models currently busy");
}
