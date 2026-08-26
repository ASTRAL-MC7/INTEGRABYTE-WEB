import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChefHat, ArrowRight, Heart } from 'lucide-react';
import { triggerHaptic, openExternalLink } from '../utils/telegram';

interface LandingViewProps {
  onTouch: () => void;
  onQuickStart?: (ingredients: string) => void;
}

const samplePrompts = [
  { label: '🥚 Tuxum + Pomidor + Pishloq', text: 'Tuxum + pomidor + pishloq' },
  { label: '🍗 Chicken + Rice + Garlic', text: 'Chicken + rice + garlic + soy sauce' },
  { label: '🥔 Kartoshka + Sariyog‘ + Ko‘kat', text: 'Kartoshka + sariyog‘ + ko‘kat' },
  { label: '🍓 Mevalar + Sut + Asal', text: 'Mevalar + sut + asal' },
];

export const LandingView: React.FC<LandingViewProps> = ({ onTouch, onQuickStart }) => {
  const handleTouch = () => {
    triggerHaptic('medium');
    onTouch();
  };

  const handleSampleClick = (text: string) => {
    triggerHaptic('light');
    if (onQuickStart) {
      onQuickStart(text);
    } else {
      onTouch();
    }
  };

  return (
    <div
      id="landing-screen"
      className="min-h-screen w-full flex flex-col justify-between items-center px-5 py-6 max-w-lg mx-auto relative overflow-hidden selection:bg-pink-500/25 selection:text-pink-950"
    >
      {/* Background ambient pink glowing orbs */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-88 h-88 bg-pink-300/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-12 w-80 h-80 bg-fuchsia-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="w-full flex items-center justify-between z-10 pt-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center font-extrabold text-xs shadow-sm shadow-pink-500/20">
            IB
          </div>
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <span className="text-[#1F1218] tracking-tight">INGREBYTE</span>
            <span className="text-pink-500 font-black text-sm leading-none">•</span>
            <span className="text-pink-600 font-extrabold tracking-wide">BYTEKITCHEN</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-pink-200/80 text-[11px] font-bold text-pink-700 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
          ✨ AI Cooking
        </div>
      </header>

      {/* Center Hero Section */}
      <main className="w-full flex-1 flex flex-col justify-center items-center text-center my-auto py-6 z-10">
        {/* Animated Badge Icon with cute pink touch */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mb-4 relative"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-b from-[#FFF5F8] to-[#FCE7F3] border-2 border-pink-200 shadow-md shadow-pink-200/40 flex items-center justify-center text-3xl">
            🍳
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center text-xs shadow-md border-2 border-[#FFF0F5]">
            <ChefHat className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center text-[10px] shadow-2xs">
            🎀
          </div>
        </motion.div>

        {/* Wordmark Logo: INGREBYTE with BYTEKITCHEN in Large Prominent Hero Plan ("yirik planda") */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.35 }}
          className="flex flex-col items-center mb-3.5 space-y-1.5"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-pink-600/90 bg-pink-100/80 px-3 py-0.5 rounded-full border border-pink-200/70 shadow-2xs">
              🎀 INGREBYTE
            </span>
          </div>

          {/* Large Hero BYTEKITCHEN ("yirik planda") */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-fuchsia-600 drop-shadow-xs"
            style={{ letterSpacing: '-0.04em' }}
          >
            BYTEKITCHEN
          </h1>
        </motion.div>

        {/* Tagline in Uzbek & English */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="space-y-1 max-w-xs sm:max-w-sm mb-6"
        >
          <p className="text-[#1F1218] font-bold text-base sm:text-lg leading-snug">
            Shunchaki nima ingredientlaringiz borligini yozing va taomingizni tayyorlang.
          </p>
          <p className="text-[#8C5E74] text-xs sm:text-sm font-medium">
            Cute, ultra-fast recipes tailored to what you have right now 🌸
          </p>
        </motion.div>

        {/* Primary TOUCH Button with Pink Pick-Me Aesthetics */}
        <motion.button
          id="btn-touch-start"
          onClick={handleTouch}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.22, duration: 0.35 }}
          className="w-full max-w-xs py-4 px-8 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-black text-lg tracking-wider shadow-lg shadow-pink-500/25 flex items-center justify-center gap-3 transition-all cursor-pointer group active:scale-95 border border-pink-300/40"
        >
          <span>TOUCH</span>
          <ArrowRight className="w-5 h-5 text-pink-100 group-hover:translate-x-1 transition-transform" />
          <Sparkles className="w-4 h-4 text-pink-200 fill-pink-200 animate-pulse" />
        </motion.button>

        {/* Quick Inspiration Pills with cute pink touch */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="w-full mt-7 flex flex-col items-center gap-2"
        >
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#9B6A82] flex items-center gap-1">
            <span>✨ Tezkor boshlash / Quick Start</span>
          </span>
          <div className="flex flex-wrap justify-center gap-1.5 max-w-sm">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                id={`sample-prompt-${idx}`}
                onClick={() => handleSampleClick(prompt.text)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/90 border border-pink-200 hover:border-pink-400 hover:bg-pink-50 text-[#3D1E2D] transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>{prompt.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer with DEVELOPER and Idea Credits */}
      <footer className="w-full pt-3.5 border-t border-pink-200/60 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-[#8C5E74] z-10">
        <div className="flex items-center gap-3.5 flex-wrap justify-center font-medium">
          <a
            id="credit-developer"
            href="https://t.me/Neindev"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => openExternalLink('https://t.me/Neindev', e)}
            className="flex items-center gap-1.5 hover:text-pink-600 transition-colors py-1 cursor-pointer group"
          >
            <span className="text-[#A37B8E]">DEVELOPER —</span>
            <span className="text-[#1F1218] font-bold underline decoration-pink-400 group-hover:text-pink-600">
              Neindev
            </span>
          </a>

          <span className="hidden sm:inline text-pink-300">•</span>

          <a
            id="credit-idea"
            href="https://t.me/mnbvcxzwmr"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => openExternalLink('https://t.me/mnbvcxzwmr', e)}
            className="flex items-center gap-1.5 hover:text-pink-600 transition-colors py-1 cursor-pointer group"
          >
            <span className="text-[#A37B8E]">Idea by —</span>
            <span className="text-[#1F1218] font-bold underline decoration-pink-400 group-hover:text-pink-600">
              Mohinur
            </span>
          </a>
        </div>

        <div className="text-[11px] font-bold text-pink-500">
          INGREBYTE • BYTEKITCHEN
        </div>
      </footer>
    </div>
  );
};
