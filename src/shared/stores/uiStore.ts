import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, FontSize, Language } from '../types';

interface UIStore {
  theme: Theme;
  fontSize: FontSize;
  language: Language;
  sidebarOpen: boolean;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setLanguage: (lang: Language) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'light',
      fontSize: 'md',
      language: 'es',
      sidebarOpen: true,

      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        root.classList.remove('dark', 'high-contrast');
        if (theme === 'dark') root.classList.add('dark');
        if (theme === 'high-contrast') root.classList.add('high-contrast');
      },

      setFontSize: (fontSize) => {
        set({ fontSize });
        const sizes: Record<FontSize, string> = {
          sm: '14px',
          md: '16px',
          lg: '18px',
          xl: '20px',
        };
        document.documentElement.style.fontSize = sizes[fontSize];
      },

      setLanguage: (language) => set({ language }),

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: 'mediconnect-ui',
    }
  )
);
