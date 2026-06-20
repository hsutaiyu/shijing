/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}'
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F7F3E9',
        'paper-dark': '#EDE8DA',
        ink: '#2C2C2C',
        'ink-light': '#5A5A5A',
        cinnabar: '#D44A4A',
        'cinnabar-light': '#F5E6E6',
        bamboo: '#6B9E75',
        'bamboo-light': '#E8F5E9',
        gold: '#C9A86C',
        'gold-light': '#F5F0E6',
        plum: '#F3E8F5',
        'plum-ink': '#8E6B8C'
      },
      fontFamily: {
        wenkai: ['"LXGW WenKai"', '"ZCOOL XiaoWei"', '"STKaiti"', 'serif'],
        body: ['"LXGW WenKai"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        pinyin: ['Arial', 'sans-serif']
      },
      boxShadow: {
        card: '0 8px 32px rgba(44,44,44,0.08)',
        float: '0 12px 40px rgba(44,44,44,0.12)'
      }
    }
  },
  plugins: []
};
