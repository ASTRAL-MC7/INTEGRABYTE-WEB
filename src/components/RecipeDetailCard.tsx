import React, { useState } from 'react';
import { Clock, Users, ChefHat, Check, Sparkles } from 'lucide-react';
import { RecipeDetail } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface RecipeDetailCardProps {
  recipe: RecipeDetail;
  onBackToSuggestions?: () => void;
  onAskAdjustment?: (question: string) => void;
}

export const RecipeDetailCard: React.FC<RecipeDetailCardProps> = ({
  recipe,
  onBackToSuggestions,
  onAskAdjustment,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);

  const toggleStep = (index: number) => {
    triggerHaptic('selection');
    setCompletedSteps(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleIngredient = (index: number) => {
    triggerHaptic('selection');
    setCheckedIngredients(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div
      id="recipe-detail-card"
      className="w-full bg-[#FFFFFF] rounded-3xl p-4 sm:p-5 border border-pink-200 shadow-sm shadow-pink-100 flex flex-col gap-4 text-[#1F1218]"
    >
      {/* Title & Metadata */}
      <div className="flex items-start justify-between gap-3 border-b border-pink-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 border border-pink-200 flex items-center justify-center text-2xl shrink-0">
            {recipe.emoji || '🍳'}
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1F1218] tracking-tight">
              {recipe.dishName}
            </h2>
            <div className="flex items-center gap-3 text-xs text-[#8C5E74] font-semibold mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-pink-500" />
                {recipe.timeMinutes || 15} min
              </span>
              {recipe.servings && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-pink-500" />
                  {recipe.servings}
                </span>
              )}
            </div>
          </div>
        </div>

        {onBackToSuggestions && (
          <button
            onClick={onBackToSuggestions}
            className="text-xs font-bold text-pink-700 hover:text-pink-900 px-2.5 py-1.5 rounded-xl bg-pink-50 border border-pink-200 cursor-pointer"
          >
            Ro‘yxatga qaytish
          </button>
        )}
      </div>

      {/* Ingredients list with toggle checkboxes */}
      {recipe.ingredientsList && recipe.ingredientsList.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-pink-900">
            <span>✨ Kerakli masalliqlar</span>
            <span className="text-[11px] font-bold text-pink-500">
              {checkedIngredients.length}/{recipe.ingredientsList.length} tayyor
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {recipe.ingredientsList.map((ingredient, idx) => {
              const isChecked = checkedIngredients.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => toggleIngredient(idx)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer border ${
                    isChecked
                      ? 'bg-pink-50/80 border-pink-300 text-pink-900 line-through opacity-70'
                      : 'bg-white border-pink-200 text-[#3D1E2D] hover:border-pink-400'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      isChecked
                        ? 'bg-pink-500 border-pink-500 text-white'
                        : 'border-pink-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-semibold">{ingredient}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Numbered Steps */}
      {recipe.steps && recipe.steps.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-pink-900 block">
            🎀 Tayyorlash ketma-ketligi / Steps
          </span>
          <div className="space-y-2">
            {recipe.steps.map((step, idx) => {
              const isDone = completedSteps.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isDone
                      ? 'bg-pink-50/50 border-pink-200 text-[#8C5E74] opacity-70'
                      : 'bg-white border-pink-200/90 hover:border-pink-400 text-[#1F1218] shadow-2xs'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-pink-400 text-white'
                        : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-2xs'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                  </div>
                  <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                    <p className={`font-medium ${isDone ? 'line-through' : ''}`}>
                      {step}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chef Tip */}
      {recipe.chefTip && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 via-[#FFF5F8] to-rose-50 border border-pink-200 text-xs text-pink-950 flex items-start gap-2.5 shadow-2xs">
          <ChefHat className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-black text-pink-900 block mb-0.5">Chef Maslahati / Pro Tip 🌸:</span>
            <p className="text-[#692A47] leading-relaxed font-medium">{recipe.chefTip}</p>
          </div>
        </div>
      )}

      {/* Quick Interactive Follow-Up Chips */}
      {onAskAdjustment && (
        <div className="pt-2 border-t border-pink-100 flex flex-wrap gap-1.5">
          <button
            onClick={() => onAskAdjustment(`Biror masalliqni almashtirish mumkinmi?`)}
            className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 hover:border-pink-400 hover:bg-pink-100 transition-all cursor-pointer shadow-2xs"
          >
            🔄 Masalliq almashtirish
          </button>
          <button
            onClick={() => onAskAdjustment(`Yana ham mazaliroq bo‘lishi uchun nima qo‘shsam bo‘ladi?`)}
            className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 hover:border-pink-400 hover:bg-pink-100 transition-all cursor-pointer shadow-2xs"
          >
            ✨ Qo‘shimcha lazzat
          </button>
          <button
            onClick={() => onAskAdjustment(`Buni mikroto‘lqinli pechda yoki duxovkada qilsa bo‘ladimi?`)}
            className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 hover:border-pink-400 hover:bg-pink-100 transition-all cursor-pointer shadow-2xs"
          >
            ⚡ Duxovka / Mikroto‘lqin
          </button>
        </div>
      )}
    </div>
  );
};
