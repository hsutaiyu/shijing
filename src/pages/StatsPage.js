import { createApp } from 'petite-vue';
import { store } from '../store.js';
import { navigate } from '../router.js';
import { PandaLogo } from '../components/PandaLogo.js';

function StatsPage() {
  async function exportProgress() {
    const data = {
      progress: store.progress,
      stats: store.stats,
      weakList: Array.from(store.weakList),
      exportedAt: new Date().toISOString()
    };
    const json = JSON.stringify(data);
    try {
      await navigator.clipboard.writeText(json);
      alert('进度 JSON 已复制到剪贴板');
    } catch {
      prompt('请复制以下内容保存：', json);
    }
  }

  async function importProgress() {
    const json = prompt('请粘贴之前导出的进度 JSON：');
    if (!json) return;
    try {
      const data = JSON.parse(json);
      await store.importData(data);
      alert('导入成功');
      navigate('stats');
    } catch (e) {
      alert('导入失败：JSON 格式不正确');
    }
  }

  async function resetProgress() {
    if (confirm('确定要重置所有学习进度吗？此操作不可恢复。')) {
      await store.resetAll();
      navigate('stats');
    }
  }

  return {
    $template: `
      <div class="page pb-24">
        <header class="flex items-center gap-4 mb-8">
          <div v-scope="PandaLogo({ size: 56 })"></div>
          <div>
            <h1 class="text-2xl font-bold text-ink font-wenkai">学习统计</h1>
            <p class="text-sm text-ink-light">见证每一步进步</p>
          </div>
        </header>

        <section class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-paper-dark rounded-[20px] shadow-card p-5 border border-black/[0.04] text-center">
            <p class="text-3xl font-bold text-cinnabar font-wenkai">{{ store.stats.streakDays || 1 }}</p>
            <p class="text-xs text-ink-light mt-1">连续学习天数</p>
          </div>
          <div class="bg-paper-dark rounded-[20px] shadow-card p-5 border border-black/[0.04] text-center">
            <p class="text-3xl font-bold text-bamboo font-wenkai">{{ Object.keys(store.progress).length }}</p>
            <p class="text-xs text-ink-light mt-1">已开始学习</p>
          </div>
        </section>

        <section class="bg-paper-dark rounded-[20px] shadow-card p-6 border border-black/[0.04] mb-6">
          <h2 class="text-lg font-bold text-ink mb-4 font-wenkai">各 Level 进度</h2>
          <div v-for="lvl in store.levels" :key="lvl.id" class="mb-4">
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium text-ink">Level {{ lvl.id }} · {{ lvl.name }}</span>
              <span class="text-ink-light">{{ store.levelProgress[lvl.id].recited }}/{{ store.levelProgress[lvl.id].total }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" :class="lvl.color === 'plum' ? 'bg-plum-ink' : 'bg-' + lvl.color" :style="{ width: (store.levelProgress[lvl.id].total > 0 ? store.levelProgress[lvl.id].recited / store.levelProgress[lvl.id].total * 100 : 0) + '%' }"></div>
            </div>
          </div>
        </section>

        <section class="bg-paper-dark rounded-[20px] shadow-card p-6 border border-black/[0.04] mb-6">
          <h2 class="text-lg font-bold text-ink mb-4 font-wenkai">三维进度</h2>
          <div class="flex items-end justify-around h-40 gap-2">
            <div v-for="d in chartData" :key="d.label" class="flex flex-col items-center flex-1">
              <span class="text-sm font-bold mb-2" :style="{ color: d.color }">{{ d.value }}</span>
              <div class="w-full max-w-[48px] rounded-t-lg transition-all duration-700" :style="{ height: (d.value / maxValue * 120) + 'px', background: d.color }"></div>
              <span class="text-xs text-ink-light mt-2 text-center">{{ d.label }}</span>
            </div>
          </div>
        </section>

        <section class="bg-paper-dark rounded-[20px] shadow-card p-6 border border-black/[0.04] mb-6">
          <h2 class="text-lg font-bold text-ink mb-4 font-wenkai">数据管理</h2>
          <div class="flex gap-3">
            <button @click="exportProgress" class="flex-1 py-3 rounded-xl border border-bamboo text-bamboo hover:bg-bamboo-light transition-colors text-sm font-medium">导出进度</button>
            <button @click="importProgress" class="flex-1 py-3 rounded-xl border border-gold text-gold hover:bg-gold-light transition-colors text-sm font-medium">导入进度</button>
          </div>
          <button @click="resetProgress" class="w-full mt-3 py-3 rounded-xl border border-cinnabar text-cinnabar hover:bg-cinnabar-light transition-colors text-sm font-medium">重置所有进度</button>
        </section>
      </div>
    `,
    store,
    PandaLogo,
    exportProgress,
    importProgress,
    resetProgress,
    get chartData() {
      const understood = store.poems.filter(p => store.getProgress(p.id).understood).length;
      const handwritten = store.poems.filter(p => store.getProgress(p.id).handwritten).length;
      const recited = store.totalProgress.recited;
      const remaining = store.totalProgress.total - recited;
      return [
        { label: '已理解', value: understood, color: '#6B9E75' },
        { label: '已手写', value: handwritten, color: '#C9A86C' },
        { label: '已背诵', value: recited, color: '#D44A4A' },
        { label: '待学习', value: remaining, color: 'rgba(0,0,0,0.1)' }
      ];
    },
    get maxValue() {
      return Math.max(...this.chartData.map(d => d.value), 1);
    }
  };
}

export function render() {
  return `<div class="max-w-3xl mx-auto px-4 sm:px-6 pt-6" v-scope="StatsPage()"></div>`;
}

export function mount(container) {
  createApp({ StatsPage, PandaLogo }).mount(container);
}
