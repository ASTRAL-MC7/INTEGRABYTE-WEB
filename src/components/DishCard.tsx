import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { DishSuggestion } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface DishCardProps {
  dish: DishSuggestion;
  onSelectDish: (dishName: string) => void;
  index: number;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onSelectDish, index }) => {
  const handleClick = () => {
    triggerHaptic('light');
    onSelectDish(dish.name);
  };

  return (
    <div
      id={`dish-card-${index}`}
      onClick={handleClick}
      className="w-full bg-[#FFFFFF] rounded-2xl p-4 border border-pink-200/80 shadow-2xs hover:shadow-xs hover:border-pink-400 hover:bg-[#FFFDFE] transition-all cursor-pointer group active:scale-[0.99] flex flex-col gap-2.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
            {dish.emoji || '🍲'}
          </div>
          <div>
            <h3 className="font-extrabold text-[#1F1218] text-base leading-tight group-hover:text-pink-600 transition-colors">
              {dish.name}
            </h3>
            <p className="text-xs text-[#7A4B60] mt-0.5 leading-relaxed line-clamp-2">
              {dish.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg shrink-0 border border-pink-100">
          <Clock className="w-3 h-3 text-pink-400" />
          <span>{dish.timeMinutes || 15}m</span>
        </div>
      </div>

      {/* Ingredient matches pills */}
      {dish.matchedIngredients && dish.matchedIngredients.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-pink-100 text-[11px] text-[#7A4B60]">
          <span className="text-pink-400 font-bold">Bor:</span>
          {dish.matchedIngredients.map((ing, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-pink-50 border border-pink-100 text-pink-900 font-semibold"
            >
              {ing}
            </span>
          ))}
          {dish.missingIngredients && dish.missingIngredients.length > 0 && (
            <span className="text-rose-600 text-[10px] ml-auto font-bold">
              +{dish.missingIngredients.length} kerak
            </span>
          )}
        </div>
      )}

      {/* Action footer */}
      <div className="flex items-center justify-between text-xs font-bold text-pink-600 pt-0.5">
        <span>Retseptni ko‘rish / View Recipe ✨</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
