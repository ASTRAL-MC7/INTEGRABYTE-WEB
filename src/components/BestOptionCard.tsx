import React from 'react';
import { Sparkles, ArrowRight, Award, Heart } from 'lucide-react';
import { BestOption } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface BestOptionCardProps {
  bestOption: BestOption;
  onCookThis: (dishName: string) => void;
}

export const BestOptionCard: React.FC<BestOptionCardProps> = ({ bestOption, onCookThis }) => {
  const handleClick = () => {
    triggerHaptic('medium');
    onCookThis(bestOption.name);
  };

  return (
    <div
      id="best-option-card"
      className="w-full rounded-3xl bg-gradient-to-br from-white via-[#FFF5F8] to-[#FCE7F3] border-2 border-pink-300 p-4 shadow-sm shadow-pink-200/50 relative overflow-hidden"
    >
      {/* Decorative cute ambient pink glow */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-pink-400/15 rounded-full blur-xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-black tracking-wide uppercase shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 fill-white" />
          <span>YOUR BEST OPTION</span>
          <span>🎀</span>
        </div>
        <span className="text-[11px] font-bold text-pink-700">
          Eng maqbul tanlov ✨
        </span>
      </div>

      {/* Main Title & Emoji */}
      <div className="flex items-start gap-3 my-1">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-pink-200 flex items-center justify-center text-2xl shrink-0">
          {bestOption.emoji || '🍳'}
        </div>
        <div className="flex-1">
          <h3 className="font-black text-[#1F1218] text-lg leading-tight">
            {bestOption.name}
          </h3>
          <p className="text-xs font-semibold text-pink-950/80 mt-1 leading-relaxed">
            “{bestOption.reason || 'Best match for what you already have.'}”
          </p>
          {bestOption.quickTip && (
            <p className="text-[11px] text-[#7A4B60] mt-1 font-medium italic">
              💡 {bestOption.quickTip}
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        id="btn-cook-best-option"
        onClick={handleClick}
        className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-pink-500/20 transition-all cursor-pointer active:scale-[0.98] border border-pink-300/40"
      >
        <span>Shuni tayyorlaymiz / Cook this dish 🌸</span>
        <ArrowRight className="w-3.5 h-3.5 text-pink-100" />
      </button>
    </div>
  );
};
