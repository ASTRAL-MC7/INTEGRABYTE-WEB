export interface DishSuggestion {
  name: string;
  emoji: string;
  tagline: string;
  timeMinutes: number;
  difficulty?: 'Easy' | 'Medium' | 'Quick';
  matchedIngredients: string[];
  missingIngredients?: string[];
}

export interface BestOption {
  name: string;
  emoji: string;
  reason: string;
  quickTip?: string;
}

export interface ExtraOption {
  requiredExtras: string;
  dishName: string;
  emoji: string;
  note: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  highlight?: string;
}

export interface RecipeDetail {
  dishName: string;
  emoji: string;
  timeMinutes: number;
  servings?: string;
  ingredientsList: string[];
  steps: string[];
  chefTip?: string;
}

export interface AssistantResponse {
  intent: 'suggestions' | 'recipe_detail' | 'adaptation' | 'unrelated' | 'general';
  language?: 'uz' | 'en' | 'ru' | string;
  summaryMessage: string;
  detectedIngredients?: string[];
  dishes?: DishSuggestion[];
  bestOption?: BestOption;
  extraOption?: ExtraOption;
  recipeDetail?: RecipeDetail;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  text?: string;
  structuredResponse?: AssistantResponse;
  isError?: boolean;
}
