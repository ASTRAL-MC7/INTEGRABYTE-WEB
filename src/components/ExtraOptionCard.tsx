import React from 'react';
import { PlusCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import { ExtraOption } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface ExtraOptionCardProps {
  extraOption: ExtraOption;
  onExplore: (query: string) => void;
}

export const ExtraOptionCard: React.FC<ExtraOptionCardProps> = ({ extraOption, onExplore }) => {
  const handleClick = () => {
    triggerHaptic('light');
    onExplore(`Menda ${extraOption.requiredExtras} ham bo'lsa, ${extraOption.dishName} qanday tayyorlanadi?`);
  };

  return (
    <div
      id="extra-option-card"
      onClick={handleClick}
      className="w-full rounded-2xl bg-[#FFFFFF] border-2 border-dashed border-pink-300 p-3.5 hover:bg-pink-50/50 hover:border-pink-400 transition-all cursor-pointer group shadow-2xs"
    >
      <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-pink-700 uppercase tracking-wider mb-1.5">
        <Sparkles className="w-3.5 h-3.5 fill-pink-400 text-pink-500" />
        <span>With a few extra ingredients... 🌸</span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl shrink-0">{extraOption.emoji || '✨'}</span>
          <div className="text-xs text-[#3D1E2D]">
            <span className="font-extrabold text-[#1F1218]">{extraOption.requiredExtras}</span>
            <span className="text-pink-400 font-bold"> → </span>
            <span className="font-extrabold text-pink-600 underline decoration-pink-300">
              {extraOption.dishName}
            </span>
            <span className="text-[#8C5E74] block text-[11px] mt-0.5 font-medium">
              {extraOption.note || 'would also be a super delicious option.'}
            </span>
          </div>
        </div>

        <ArrowUpRight className="w-4 h-4 text-pink-400 group-hover:text-pink-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
      </div>
    </div>
  );
};
