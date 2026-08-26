import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

const cookingQuotes = [
  'Finding something super tasty... 🌸',
  'Matching cute ingredients... ✨',
  'Pairing delicious flavors together... 🍓',
  'Crafting the easiest recipe for you... 🎀',
];

export const LoadingState: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % cookingQuotes.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="loading-cooking-state"
      className="w-full flex flex-col items-center justify-center py-7 px-4"
    >
      <div className="relative mb-3.5">
        {/* Animated subtle pink ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          className="w-14 h-14 rounded-2xl border-2 border-dashed border-pink-400 bg-pink-100/60"
        />

        {/* Center Pan & Sparkle */}
        <motion.div
          animate={{ y: [0, -4, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center text-xl"
        >
          🍳
        </motion.div>

        <div className="absolute -top-1 -right-1">
          <motion.div
            animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-pink-500 fill-pink-300" />
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1F1218]">
        <motion.span
          key={quoteIndex}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.2 }}
        >
          {cookingQuotes[quoteIndex]}
        </motion.span>
      </div>

      <div className="flex items-center gap-1 mt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};
