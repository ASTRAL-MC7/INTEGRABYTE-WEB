import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Code2, Sparkles, ExternalLink } from 'lucide-react';
import { openExternalLink, triggerHaptic } from '../utils/telegram';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="w-full max-w-sm bg-[#FFFFFF] rounded-3xl p-6 border border-pink-200 shadow-2xl relative text-[#1F1218] flex flex-col gap-4"
        >
          {/* Close button */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-700 hover:text-pink-900 cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Logo with INGREBYTE • BYTEKITCHEN */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center font-bold text-xl shadow-sm shadow-pink-500/30">
              🍳
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <h3 className="font-extrabold text-base text-[#1F1218] tracking-tight">
                  INGREBYTE
                </h3>
                <span className="text-pink-500 font-black text-base">•</span>
                <span className="text-[11px] font-black text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded-md border border-pink-200">
                  BYTEKITCHEN
                </span>
              </div>
              <p className="text-xs text-[#8C5E74] mt-1 font-medium">
                Ultra-Fast AI Cooking Assistant for Telegram & Web
              </p>
            </div>
          </div>

          <p className="text-xs text-[#572B40] leading-relaxed">
            Shunchaki nima ingredientlaringiz borligini yozing va taomingizni tayyorlang. Instant recipe recommendations & cooking steps with a cute pink touch 🌸
          </p>

          {/* Credits Box */}
          <div className="space-y-2 pt-2 border-t border-pink-100">
            <a
              id="modal-credit-developer"
              href="https://t.me/Neindev"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => openExternalLink('https://t.me/Neindev', e)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-pink-50/70 border border-pink-200 hover:border-pink-400 hover:bg-pink-100/80 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-extrabold text-[#9B6A82] uppercase block">
                    DEVELOPER
                  </span>
                  <span className="text-xs font-bold text-[#1F1218] group-hover:text-pink-600">
                    Neindev (t.me/Neindev)
                  </span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-pink-400 group-hover:text-pink-600" />
            </a>

            <a
              id="modal-credit-idea"
              href="https://t.me/mnbvcxzwmr"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => openExternalLink('https://t.me/mnbvcxzwmr', e)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-pink-50/70 border border-pink-200 hover:border-pink-400 hover:bg-pink-100/80 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-extrabold text-[#9B6A82] uppercase block">
                    Idea by
                  </span>
                  <span className="text-xs font-bold text-[#1F1218] group-hover:text-pink-600">
                    Mohinur (t.me/mnbvcxzwmr)
                  </span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-pink-400 group-hover:text-pink-600" />
            </a>
          </div>

          <div className="text-center pt-1 text-[11px] font-semibold text-pink-400">
            Vercel & Telegram Mini App Ready • Zero Errors ✨
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
