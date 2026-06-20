/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}'
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'paper-dark': 'var(--paper-dark)',
        ink: 'var(--ink)',
        'ink-light': 'var(--ink-light)',
        cinnabar: 'var(--cinnabar)',
        'cinnabar-light': 'var(--cinnabar-light)',
        bamboo: 'var(--bamboo)',
        'bamboo-light': 'var(--bamboo-light)',
        gold: 'var(--gold)',
        'gold-light': 'var(--gold-light)',
        plum: 'var(--plum)',
        'plum-ink': 'var(--plum-ink)'
      },
      fontFamily: {
        wenkai: ['"LXGW WenKai"', '"ZCOOL XiaoWei"', '"STKaiti"', 'serif'],
        body: ['"LXGW WenKai"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        pinyin: ['Arial', 'sans-serif']
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        float: 'var(--shadow-float)'
      }
    }
  },
  plugins: []
};
