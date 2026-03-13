/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd',
          300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9',
          600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e',
        },
        dark: {
          100: '#1a1a2e',
          200: '#13131f',
          300: '#0d0d18',
        },
      },
      fontFamily: {
        sans:    ['Space Grotesk', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float':         'float 4s ease-in-out infinite',
        'float-reverse': 'floatReverse 4s ease-in-out infinite',
        'pulse-ring':    'pulse-ring 2s cubic-bezier(0.455,0.03,0.515,0.955) infinite',
        'gradient':      'gradient-shift 6s ease infinite',
        'fade-up':       'fadeUp 0.6s ease forwards',
        'slide-right':   'slideRight 0.6s ease forwards',
        'slide-left':    'slideLeft 0.6s ease forwards',
        'scale-in':      'scaleIn 0.4s ease forwards',
        'orbit':         'orbit 8s linear infinite',
        'morph':         'morphBlob 10s ease-in-out infinite',
        'shine':         'shine 4s linear infinite',
        'marquee':       'marquee 20s linear infinite',
        'scan':          'scanline 4s linear infinite',
      },
      keyframes: {
        float:          { '0%,100%': { transform: 'translateY(0)'    }, '50%': { transform: 'translateY(-12px)' } },
        floatReverse:   { '0%,100%': { transform: 'translateY(0)'    }, '50%': { transform: 'translateY(8px)'  } },
        'pulse-ring':   { '0%': { boxShadow: '0 0 0 0 rgba(14,165,233,0.4)' }, '70%': { boxShadow: '0 0 0 12px rgba(14,165,233,0)' }, '100%': { boxShadow: '0 0 0 0 rgba(14,165,233,0)' } },
        'gradient-shift': { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        fadeUp:         { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideRight:     { from: { opacity: '0', transform: 'translateX(-24px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        slideLeft:      { from: { opacity: '0', transform: 'translateX(24px)'  }, to: { opacity: '1', transform: 'translateX(0)' } },
        scaleIn:        { from: { opacity: '0', transform: 'scale(0.85)' }, to: { opacity: '1', transform: 'scale(1)' } },
        orbit:          { from: { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' }, to: { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' } },
        morphBlob:      { '0%,100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }, '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }, '50%': { borderRadius: '50% 60% 30% 60% / 30% 60% 70% 40%' }, '75%': { borderRadius: '60% 40% 60% 30% / 70% 30% 60% 40%' } },
        shine:          { '0%': { backgroundPosition: '0% center' }, '100%': { backgroundPosition: '200% center' } },
        marquee:        { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        scanline:       { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100vh)' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': "linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)",
        'hero-gradient': 'linear-gradient(135deg, #0d0d18 0%, #13131f 50%, #0d0d18 100%)',
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
      boxShadow: {
        'glow':    '0 0 20px rgba(14,165,233,0.3)',
        'glow-lg': '0 0 40px rgba(14,165,233,0.4)',
        'inner-glow': 'inset 0 0 20px rgba(14,165,233,0.1)',
      },
      screens: { xs: '475px' },
      spacing: { '18': '4.5rem' },
    },
  },
  plugins: [],
}