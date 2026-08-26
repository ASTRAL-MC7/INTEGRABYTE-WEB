/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingView } from './components/LandingView';
import { ChatView } from './components/ChatView';
import { InfoModal } from './components/InfoModal';
import { initTelegramApp, triggerHaptic } from './utils/telegram';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');
  const [initialQuery, setInitialQuery] = useState<string>('');
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    initTelegramApp();
  }, []);

  // Telegram native BackButton integration
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.BackButton) {
      const backBtn = window.Telegram.WebApp.BackButton;
      if (currentView === 'chat') {
        backBtn.show();
        const handleBack = () => {
          triggerHaptic('light');
          setCurrentView('landing');
        };
        backBtn.onClick(handleBack);
        return () => {
          backBtn.offClick(handleBack);
          backBtn.hide();
        };
      } else {
        backBtn.hide();
      }
    }
  }, [currentView]);

  const handleStartChat = (query?: string) => {
    if (query) {
      setInitialQuery(query);
    } else {
      setInitialQuery('');
    }
    setCurrentView('chat');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <div className="w-full min-h-screen bg-[#FFF0F5] text-[#1F1218] flex flex-col font-sans selection:bg-pink-500/25 selection:text-pink-950">
      <AnimatePresence mode="wait">
        {currentView === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full flex-1"
          >
            <LandingView
              onTouch={() => handleStartChat()}
              onQuickStart={(q) => handleStartChat(q)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full flex-1"
          >
            <ChatView
              onBackToLanding={handleBackToLanding}
              onOpenInfo={() => setIsInfoOpen(true)}
              initialQuery={initialQuery}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}
