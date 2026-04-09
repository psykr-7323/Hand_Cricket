/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        arena: {
          void: '#070d1f',
          surface: '#0c1324',
          'container-low': '#151b2d',
          'container': '#1a2137',
          'container-high': '#232938',
          'container-highest': '#2e3447',
          primary: '#5af0b3',
          'primary-dark': '#34d399',
          'primary-glow': 'rgba(90, 240, 179, 0.25)',
          secondary: '#ffb3ad',
          'secondary-dark': '#ef4444',
          tertiary: '#bfd8ff',
          outline: '#85948b',
          'outline-variant': '#3c4a42',
          'on-surface': '#e2e8f0',
          'on-surface-dim': '#94a3b8',
          'on-surface-faint': '#64748b',
        },
      },
      boxShadow: {
        'arena-glow': '0 0 30px rgba(90, 240, 179, 0.15)',
        'arena-ambient': '0 30px 50px rgba(0, 0, 0, 0.40)',
        'arena-btn': '0 4px 0 #1a8a5e',
        'arena-btn-active': '0 2px 0 #1a8a5e',
        'arena-inset': 'inset 0 4px 12px rgba(0, 0, 0, 0.5)',
        'wicket-glow': '0 0 60px rgba(255, 179, 173, 0.3), 0 0 120px rgba(255, 179, 173, 0.15)',
        'victory-glow': '0 0 60px rgba(90, 240, 179, 0.3), 0 0 120px rgba(90, 240, 179, 0.15)',
      },
      backgroundImage: {
        'arena-gradient': 'linear-gradient(135deg, #5af0b3, #34d399)',
        'arena-danger': 'linear-gradient(135deg, #ef4444, #dc2626)',
        'arena-surface-radial': 'radial-gradient(ellipse at top, rgba(90, 240, 179, 0.05), transparent 50%)',
      },
      letterSpacing: {
        'esports': '0.1em',
        'broadcast': '0.22em',
        'wide-broadcast': '0.34em',
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'score-pop': 'score-pop 0.5s ease-out',
        'wicket-shake': 'wicket-shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'glow-breathe': 'glow-breathe 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { textShadow: '0 0 20px rgba(90, 240, 179, 0.5), 0 0 40px rgba(90, 240, 179, 0.3)' },
          '50%': { textShadow: '0 0 30px rgba(90, 240, 179, 0.7), 0 0 60px rgba(90, 240, 179, 0.5)' },
        },
        'score-pop': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'wicket-shake': {
          '0%, 100%': { transform: 'translateX(0) rotate(0)' },
          '15%': { transform: 'translateX(-8px) rotate(-1deg)' },
          '30%': { transform: 'translateX(8px) rotate(1deg)' },
          '45%': { transform: 'translateX(-6px) rotate(-0.5deg)' },
          '60%': { transform: 'translateX(6px) rotate(0.5deg)' },
          '75%': { transform: 'translateX(-3px)' },
        },
        'glow-breathe': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(90, 240, 179, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(90, 240, 179, 0.25)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
