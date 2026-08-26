import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Info, Send, AlertCircle, RefreshCw, Plus, Sparkles, X, Heart } from 'lucide-react';
import { ChatMessage, AssistantResponse } from '../types';
import { DishCard } from './DishCard';
import { BestOptionCard } from './BestOptionCard';
import { ExtraOptionCard } from './ExtraOptionCard';
import { RecipeDetailCard } from './RecipeDetailCard';
import { LoadingState } from './LoadingState';
import { triggerHaptic, openExternalLink } from '../utils/telegram';

interface ChatViewProps {
  onBackToLanding: () => void;
  onOpenInfo: () => void;
  initialQuery?: string;
}

// Common ingredients with cute emojis that users can tap '+' to continuously append
const quickIngredientAddList = [
  { name: 'Tuxum', emoji: '🥚' },
  { name: 'Pomidor', emoji: '🍅' },
  { name: 'Piyoz', emoji: '🧅' },
  { name: 'Kartoshka', emoji: '🥔' },
  { name: 'Go‘sht / Chicken', emoji: '🍗' },
  { name: 'Pishloq / Cheese', emoji: '🧀' },
  { name: 'Guruch / Rice', emoji: '🍚' },
  { name: 'Non / Bread', emoji: '🍞' },
  { name: 'Sarimsoq / Garlic', emoji: '🧄' },
  { name: 'Sabzi / Carrot', emoji: '🥕' },
  { name: 'Makaron / Pasta', emoji: '🍝' },
  { name: 'Ko‘katlar', emoji: '🌿' },
  { name: 'Qaymoq / Cream', emoji: '🥛' },
  { name: 'Sut / Milk', emoji: '🧃' },
];

export const ChatView: React.FC<ChatViewProps> = ({
  onBackToLanding,
  onOpenInfo,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial query trigger on mount
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery.trim());
    }
  }, []);

  // Multi-plus appender: adds "+" or "+ ingredient" next to current text
  const handleAppendPlus = () => {
    triggerHaptic('light');
    setInputValue(prev => {
      const trimmed = prev.trim();
      if (!trimmed) {
        return '';
      }
      return `${trimmed} + `;
    });
    inputRef.current?.focus();
  };

  const handleAppendIngredient = (ingName: string) => {
    triggerHaptic('light');
    setInputValue(prev => {
      const trimmed = prev.trim();
      if (!trimmed) {
        return ingName;
      }
      if (trimmed.endsWith('+')) {
        return `${trimmed} ${ingName}`;
      }
      return `${trimmed} + ${ingName}`;
    });
    inputRef.current?.focus();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    triggerHaptic('medium');
    setErrorText(null);
    setInputValue('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => m.text)
        .slice(-4)
        .map(m => ({
          role: m.sender === 'user' ? ('user' as const) : ('model' as const),
          text: m.text || JSON.stringify(m.structuredResponse),
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (data && data.fallback) {
          const fallbackMsg: ChatMessage = {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            timestamp: Date.now(),
            text: data.fallback.summaryMessage || 'Something went wrong. Try again.',
            structuredResponse: data.fallback,
          };
          setMessages(prev => [...prev, fallbackMsg]);
          return;
        }
        throw new Error(data?.details || `Server error ${res.status}`);
      }

      if (data) {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          timestamp: Date.now(),
          text: data.summaryMessage,
          structuredResponse: data,
        };

        setMessages(prev => [...prev, assistantMessage]);
        triggerHaptic('success');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorText('Model band yoki xatolik yuz berdi. Qayta urinib ko‘ring.');
      triggerHaptic('error');
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
    if (lastUserMsg && lastUserMsg.text) {
      handleSendMessage(lastUserMsg.text);
    }
  };

  const handleReset = () => {
    triggerHaptic('light');
    setMessages([]);
    setErrorText(null);
    setInputValue('');
  };

  const handleSelectDish = (dishName: string) => {
    handleSendMessage(`Qanday qilib ${dishName} tayyorlayman? Qisqa va tezkor retseptini bering.`);
  };

  return (
    <div
      id="chat-screen"
      className="min-h-screen w-full flex flex-col justify-between bg-[#FFF0F5] max-w-xl mx-auto relative selection:bg-pink-500/25 selection:text-pink-950"
    >
      {/* Top Header Bar: INGREBYTE • BYTEKITCHEN with dot in between */}
      <header className="sticky top-0 z-30 w-full bg-[#FFF0F5]/95 backdrop-blur-md border-b border-pink-200/80 px-4 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            id="btn-back-landing"
            onClick={() => {
              triggerHaptic('light');
              onBackToLanding();
            }}
            className="w-8 h-8 rounded-xl bg-white border border-pink-200 flex items-center justify-center text-pink-700 hover:bg-pink-50 active:scale-95 transition-all cursor-pointer shadow-2xs"
            title="Bosh sahifa / Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            {/* INGREBYTE • BYTEKITCHEN side-by-side with dot */}
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-sm tracking-tight text-[#1F1218]">
                INGREBYTE
              </span>
              <span className="text-pink-500 font-black text-base leading-none">
                •
              </span>
              <span className="font-black text-sm tracking-tight text-pink-600 bg-pink-100/90 px-1.5 py-0.5 rounded-md border border-pink-200/60">
                BYTEKITCHEN
              </span>
            </div>
            <span className="text-[10px] text-[#8C5E74] font-medium leading-tight block mt-0.5">
              ✨ Ultra-Fast AI Cooking Assistant
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              id="btn-reset-chat"
              onClick={handleReset}
              className="p-2 rounded-xl text-[#8C5E74] hover:text-pink-600 hover:bg-pink-100/60 transition-colors cursor-pointer"
              title="Tozalash / Clear"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            id="btn-info-modal"
            onClick={() => {
              triggerHaptic('light');
              onOpenInfo();
            }}
            className="p-2 rounded-xl text-[#8C5E74] hover:text-pink-600 hover:bg-pink-100/60 transition-colors cursor-pointer"
            title="Dasturchilar haqida / Info"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages Feed */}
      <main className="flex-1 w-full p-4 overflow-y-auto space-y-4">
        {/* Welcome Empty State */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center py-6 px-2 max-w-sm mx-auto space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-pink-200 flex items-center justify-center text-3xl shadow-sm">
              🍳
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#1F1218] tracking-tight flex items-center justify-center gap-1.5">
                <span>Nima masalliqlar bor?</span>
                <span>🌸</span>
              </h2>
              <p className="text-xs text-[#8C5E74] leading-relaxed">
                Quyidagi masalliqlarni bosing yoki o‘zingiz yozing. Bir necha soniyada eng mazali taomlarni topib beraman.
              </p>
            </div>

            {/* Quick multi-selection suggestions */}
            <div className="w-full pt-2 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#9B6A82] flex items-center gap-1">
                  <span>Masalliqlarni qo‘shing (+):</span>
                </span>
                <span className="text-[10px] text-pink-600 font-bold">
                  ✨ Tezkor tanlash
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {quickIngredientAddList.slice(0, 6).map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleAppendIngredient(item.name)}
                    className="text-xs font-bold py-2 px-3 rounded-xl bg-white border border-pink-200 hover:border-pink-400 hover:bg-pink-50 text-[#3D1E2D] text-left transition-all flex items-center justify-between cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{item.emoji}</span>
                      <span>{item.name}</span>
                    </span>
                    <span className="w-5 h-5 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center font-black text-xs">
                      +
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Items */}
        {messages.map(msg => (
          <div key={msg.id} className="w-full flex flex-col gap-2">
            {/* User Message Bubble with Pink Gradient */}
            {msg.sender === 'user' && (
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-sm shadow-pink-500/20 leading-relaxed">
                  {msg.text}
                </div>
              </div>
            )}

            {/* Assistant Structured Message Cards */}
            {msg.sender === 'assistant' && msg.structuredResponse && (
              <div className="flex flex-col gap-3 w-full animate-fade-in">
                {/* Intro summary sentence */}
                {msg.structuredResponse.summaryMessage && (
                  <div className="text-xs font-bold text-[#572B40] px-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                    <span>{msg.structuredResponse.summaryMessage}</span>
                  </div>
                )}

                {/* If standard Suggestions Intent */}
                {msg.structuredResponse.intent === 'suggestions' && (
                  <>
                    {/* Best Option Highlight Card (FIRST for instant 3-sec decision) */}
                    {msg.structuredResponse.bestOption && (
                      <BestOptionCard
                        bestOption={msg.structuredResponse.bestOption}
                        onCookThis={handleSelectDish}
                      />
                    )}

                    {/* Dish Suggestions List */}
                    {msg.structuredResponse.dishes && msg.structuredResponse.dishes.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#9B6A82] px-1 block">
                          🎀 Boshqa tayyorlash mumkin bo‘lgan taomlar:
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.structuredResponse.dishes.map((dish, idx) => (
                            <DishCard
                              key={idx}
                              dish={dish}
                              index={idx}
                              onSelectDish={handleSelectDish}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Extra Ingredients Card */}
                    {msg.structuredResponse.extraOption && (
                      <ExtraOptionCard
                        extraOption={msg.structuredResponse.extraOption}
                        onExplore={handleSendMessage}
                      />
                    )}

                    {/* Fast Follow-up action chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1 px-1">
                      <button
                        onClick={() =>
                          handleSendMessage('Eng tez tayyorlanadiganini qanday qilaman?')
                        }
                        className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white border border-pink-200 text-pink-700 hover:border-pink-400 hover:bg-pink-50 transition-all cursor-pointer shadow-2xs"
                      >
                        ⚡ 15 daqiqalik tezkor usul
                      </button>
                      <button
                        onClick={() =>
                          handleSendMessage('Pishirish jarayonini qisqa tushuntirib bering')
                        }
                        className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white border border-pink-200 text-pink-700 hover:border-pink-400 hover:bg-pink-50 transition-all cursor-pointer shadow-2xs"
                      >
                        📖 Retseptini ko‘rish
                      </button>
                    </div>
                  </>
                )}

                {/* If Recipe Detail Intent */}
                {(msg.structuredResponse.intent === 'recipe_detail' ||
                  msg.structuredResponse.intent === 'adaptation') &&
                  msg.structuredResponse.recipeDetail && (
                    <RecipeDetailCard
                      recipe={msg.structuredResponse.recipeDetail}
                      onAskAdjustment={handleSendMessage}
                    />
                  )}

                {/* If Unrelated query */}
                {msg.structuredResponse.intent === 'unrelated' && (
                  <div className="p-4 rounded-2xl bg-white border border-pink-200 text-xs text-[#1F1218] space-y-2 shadow-2xs">
                    <p className="font-bold text-pink-900 flex items-center gap-1.5">
                      <span>👩‍🍳 Ingrebyte ByteKitchen faqat oshpazlik bo‘yicha yordam beradi.</span>
                    </p>
                    <p className="text-[#8C5E74]">
                      Muzlatgichingiz yoki oshxonangizda bor mahsulotlarni yozing (masalan: tuxum + pomidor + pishloq) va men sizga yoqimli retseptlar topib beraman ✨
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && <LoadingState />}

        {/* Error Notification */}
        {errorText && (
          <div className="w-full p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorText}</span>
            </div>
            <button
              onClick={handleRetry}
              className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer active:scale-95 transition-all shadow-2xs"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Qayta urinish</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Sticky Bottom Bar with Pink Ingredient Tray & Multi-Plus Appender */}
      <footer className="sticky bottom-0 z-30 w-full bg-[#FFF0F5]/95 backdrop-blur-md border-t border-pink-200/80 p-3 tg-safe-bottom space-y-2 shadow-sm">
        {/* Ingredient quick-add scrollable chips */}
        <div className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
          {quickIngredientAddList.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAppendIngredient(item.name)}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-pink-200 hover:border-pink-400 hover:bg-pink-50 text-xs font-bold text-[#3D1E2D] transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <span>{item.emoji}</span>
              <span>{item.name}</span>
              <span className="text-pink-600 font-black text-[13px] ml-0.5">+</span>
            </button>
          ))}
        </div>

        {/* Input Form with Dedicated '+' Appender Button */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="w-full relative flex items-center gap-1.5"
        >
          {/* Quick '+' button to insert '+' separator into input */}
          <button
            type="button"
            id="btn-add-plus"
            onClick={handleAppendPlus}
            title="Qo'shish / Add '+' separator"
            className="w-10 h-10 rounded-2xl bg-white border border-pink-300 hover:border-pink-500 hover:bg-pink-50 text-pink-600 font-black text-lg flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-2xs shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="relative flex-1">
            <input
              ref={inputRef}
              id="input-ingredients"
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Masalliqlar: Tuxum + pomidor + pishloq..."
              disabled={isLoading}
              className="w-full py-3 pl-3.5 pr-11 rounded-2xl bg-white border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/25 text-xs sm:text-sm font-medium text-[#1F1218] placeholder:text-[#A37B8E] outline-none shadow-2xs transition-all disabled:opacity-60"
            />

            {/* Clear input if has text */}
            {inputValue.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setInputValue('');
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A37B8E] hover:text-[#1F1218] p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            id="btn-send-message"
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-10 h-10 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-35 text-white flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95 shadow-sm shadow-pink-500/25 shrink-0 border border-pink-300/40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Telegram mini footer credits */}
        <div className="flex items-center justify-between text-[10px] text-[#8C5E74] pt-1.5 px-1 font-medium">
          <a
            id="chat-credit-developer"
            href="https://t.me/Neindev"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => openExternalLink('https://t.me/Neindev', e)}
            className="hover:text-pink-600 transition-colors cursor-pointer py-0.5"
          >
            DEVELOPER: <span className="font-bold underline decoration-pink-400">Neindev</span>
          </a>
          <span className="text-[10px] font-black text-pink-600 flex items-center gap-1">
            <span>INGREBYTE</span>
            <span>•</span>
            <span>BYTEKITCHEN</span>
          </span>
          <a
            id="chat-credit-idea"
            href="https://t.me/mnbvcxzwmr"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => openExternalLink('https://t.me/mnbvcxzwmr', e)}
            className="hover:text-pink-600 transition-colors cursor-pointer py-0.5"
          >
            Idea by: <span className="font-bold underline decoration-pink-400">Mohinur</span>
          </a>
        </div>
      </footer>
    </div>
  );
};
