/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563EB',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14B8A6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        surface: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
        },
        // ── Landing-only refined palette (clinical / editorial) ──────────
        clinical: {
          50: '#EEF3FC',
          100: '#DCE6F9',
          200: '#B3C9F0',
          300: '#84A5E4',
          400: '#5279D6',
          500: '#3457C9',
          600: '#1B3FB8',
          700: '#152F8C',
          800: '#102266',
          900: '#0B1B33',
        },
        vital: {
          50: '#FFF1EE',
          100: '#FFE0DB',
          300: '#FF9C8E',
          400: '#FF8470',
          500: '#FF6B5C',
          600: '#E84F40',
          700: '#C13C2F',
        },
        mist: {
          50: '#F5F7FC',
          100: '#EBEFF8',
          200: '#DCE3F2',
        },
        ink: {
          900: '#101826',
          700: '#33405A',
          500: '#64748B',
        },
        // ── Smart Salud Core Palette ──────────
        smart: {
          // Branding
          blue: '#3b82f6', // Azul Confianza
          green: '#10b981', // Verde Salud
          
          // Fondos y Superficies (Modo Claro)
          bg: '#ffffff',
          surface: '#f8fafc',
          border: '#e2e8f0',
          
          // Texto (Modo Claro)
          title: '#1e293b',
          body: '#334155',
          muted: '#64748b',
          
          // Modo Oscuro
          dark: {
            bg: '#0d1117',
            text: '#f0f6fc',
            primary: '#2deda0',
            secondary: '#60aaff',
            border: '#30363d',
            surface1: '#161b22',
            surface2: '#21262d',
          },

          // Estados y Feedback
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b',
          disabled: '#9ca3af',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        data: ['Manrope', 'sans-serif'],
        // Landing-only editorial display face
        display: ['Fraunces', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-md': '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
        'card-lg': '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.05)',
        'primary': '0 4px 14px 0 rgba(37, 99, 235, 0.25)',
        'clinical': '0 20px 40px -12px rgba(11, 27, 51, 0.18)',
        'clinical-sm': '0 8px 20px -6px rgba(11, 27, 51, 0.12)',
        'vital': '0 10px 24px -6px rgba(255, 107, 92, 0.35)',
      },
    },
  },
  plugins: [],
};
