// Telegram Mini App utility helpers

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        openTelegramLink: (url: string) => void;
        openLink: (url: string) => void;
      };
    };
  }
}

export function isTelegramWebApp(): boolean {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.Telegram?.WebApp?.initData && window.Telegram.WebApp.initData.length > 0)
  );
}

export function initTelegramApp(): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    try {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      if (window.Telegram.WebApp.headerColor) {
        window.Telegram.WebApp.headerColor = '#FFF0F5';
      }
      if (window.Telegram.WebApp.backgroundColor) {
        window.Telegram.WebApp.backgroundColor = '#FFF0F5';
      }
    } catch (e) {
      console.warn('Telegram WebApp init warning:', e);
    }
  }
}

export function triggerHaptic(style: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'error' = 'light'): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
    try {
      const haptic = window.Telegram.WebApp.HapticFeedback;
      if (style === 'selection') {
        haptic.selectionChanged();
      } else if (style === 'success' || style === 'error') {
        haptic.notificationOccurred(style);
      } else {
        haptic.impactOccurred(style);
      }
    } catch {
      // Haptics not available in browser
    }
  }
}

export function openExternalLink(url: string, e?: { preventDefault?: () => void }): void {
  triggerHaptic('light');
  if (typeof window === 'undefined') return;

  // If inside real Telegram WebApp client
  if (isTelegramWebApp()) {
    try {
      if (url.startsWith('https://t.me/')) {
        window.Telegram?.WebApp?.openTelegramLink(url);
        e?.preventDefault();
        return;
      } else if (window.Telegram?.WebApp?.openLink) {
        window.Telegram.WebApp.openLink(url);
        e?.preventDefault();
        return;
      }
    } catch (err) {
      console.warn('Telegram open link error:', err);
    }
  }

  // Fallback for regular browser / iframe environments
  try {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = url;
    }
  } catch {
    window.location.href = url;
  }
}
