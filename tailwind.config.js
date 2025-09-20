/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map existing CSS variables to Tailwind colors
        background: '#f8fafc',      // var(--bg)
        foreground: '#0f172a',      // var(--text)
        muted: {
          DEFAULT: '#64748b',       // var(--muted)
          foreground: '#64748b',
        },
        card: {
          DEFAULT: '#ffffff',       // var(--card)
          foreground: '#0f172a',
        },
        border: '#e2e8f0',          // var(--border)
        primary: {
          DEFAULT: '#0ea5e9',       // var(--accent)
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#0ea5e9',       // var(--accent)
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#10b981',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#ffffff',
        },
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}