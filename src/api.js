let poemsCache = null;

export async function loadPoems() {
  if (poemsCache) return poemsCache;
  const res = await fetch('./data/poems.json');
  poemsCache = await res.json();
  return poemsCache;
}

export function getLevels() {
  return [
    { id: 1, name: '零基础热身', subtitle: '从最简单的开始', color: 'cinnabar', light: 'cinnabar-light', desc: '18首 · 朗朗上口' },
    { id: 2, name: '入门进阶', subtitle: '感受诗的节奏', color: 'bamboo', light: 'bamboo-light', desc: '19首 · 画面初现' },
    { id: 3, name: '中等挑战', subtitle: '体会情感与哲理', color: 'gold', light: 'gold-light', desc: '19首 · 意蕴渐深' },
    { id: 4, name: '进阶提升', subtitle: '品味千古名句', color: 'plum', light: 'plum', desc: '19首 · 气象万千' }
  ];
}
