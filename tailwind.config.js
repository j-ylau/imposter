/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic tokens
        bg: 'var(--bg)',
        'bg-subtle': 'var(--bg-subtle)',
        card: 'var(--card)',
        'card-elevated': 'var(--card-elevated)',

        fg: 'var(--fg)',
        'fg-muted': 'var(--fg-muted)',
        'fg-subtle': 'var(--fg-subtle)',

        border: 'var(--border)',
        'border-hover': 'var(--border-hover)',

        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          fg: 'var(--primary-fg)',
          subtle: 'var(--primary-subtle)',
          muted: 'var(--primary-muted)',
          // Keep original shades for gradient compatibility
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },

        success: {
          DEFAULT: 'var(--success)',
          subtle: 'var(--success-subtle)',
          fg: 'var(--success-fg)',
        },

        danger: {
          DEFAULT: 'var(--danger)',
          subtle: 'var(--danger-subtle)',
          fg: 'var(--danger-fg)',
        },

        warning: {
          DEFAULT: 'var(--warning)',
          subtle: 'var(--warning-subtle)',
          fg: 'var(--warning-fg)',
        },

        'host-badge': 'var(--host-badge)',
        'host-badge-fg': 'var(--host-badge-fg)',
        'imposter-badge': 'var(--imposter-badge)',
        'imposter-badge-fg': 'var(--imposter-badge-fg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
