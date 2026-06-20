import { createApp } from 'petite-vue';
import { store } from '../store.js';
import { navigate } from '../router.js';

function LevelPage() {
  const level = store.levels.find(l => l.id === store.currentLevel);
  const accentClass = { cinnabar: 'text-cinnabar', bamboo: 'text-bamboo', gold: 'text-gold', plum: 'text-plum-ink' };
  const bgClass = { cinnabar: 'bg-cinnabar-light', bamboo: 'bg-bamboo-light', gold: 'bg-gold-light', plum: 'bg-plum' };
  const poems = store.poems.filter(p => p.level === store.currentLevel);

  return {
    $template: `
      <div class="page pb-8">
        <header class="flex items-center gap-3 mb-6">
          <button @click="navigate('home')" class="p-2 rounded-xl hover:bg-black/5 transition-colors">
            <svg class="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-ink font-wenkai">Level {{ level.id }} · {{ level.name }}</h1>
            <p class="text-sm text-ink-light">{{ level.subtitle }}</p>
          </div>
        </header>

        <section class="bg-paper-dark rounded-[20px] shadow-card p-5 mb-6 border border-black/[0.04]">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-ink-light">本关进度</span>
            <span class="font-medium" :class="accentClass[level.color]">{{ store.levelProgress[level.id].recited }}/{{ store.levelProgress[level.id].total }} 首已背诵</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" :class="level.color === 'plum' ? 'bg-plum-ink' : 'bg-' + level.color" :style="{ width: (store.levelProgress[level.id].total > 0 ? store.levelProgress[level.id].recited / store.levelProgress[level.id].total * 100 : 0) + '%' }"></div>
          </div>
          <div class="flex gap-4 mt-4 text-xs">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-bamboo"></span>理解 {{ store.levelProgress[level.id].understood }}</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-gold"></span>手写 {{ store.levelProgress[level.id].handwritten }}</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-cinnabar"></span>背诵 {{ store.levelProgress[level.id].recited }}</span>
          </div>
        </section>

        <section>
          <h2 class="text-lg font-bold text-ink mb-4 font-wenkai flex items-center gap-2">
            <span class="w-1.5 h-5 rounded-full" :class="level.color === 'plum' ? 'bg-plum-ink' : 'bg-' + level.color"></span>诗单
          </h2>
          <div class="space-y-3">
            <div v-for="(poem, i) in poems" :key="poem.id" @click="navigate('detail', {poemId: poem.id})"
              class="stagger-item cursor-pointer bg-paper-dark rounded-[16px] p-4 shadow-card border border-black/[0.04] hover:shadow-float transition-all flex items-center gap-3"
              :style="{ animationDelay: i * 50 + 'ms' }">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-wenkai flex-shrink-0" :class="[bgClass[level.color], accentClass[level.color]]">{{ poem.id }}</div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-bold font-wenkai truncate" :class="{ 'text-cinnabar': store.getProgress(poem.id).understood && store.getProgress(poem.id).handwritten && store.getProgress(poem.id).recited }">{{ poem.title }}</h3>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-black/5 text-ink-light">{{ poem.dynasty }}</span>
                  <span class="text-xs text-ink-light truncate">{{ poem.author }}</span>
                </div>
                <p class="text-xs text-ink-light mt-1 truncate">{{ poem.content.join(' ') }}</p>
              </div>
              <div class="flex flex-col items-end gap-2 flex-shrink-0">
                <div class="flex gap-1">
                  <span class="w-2.5 h-2.5 rounded-full" :class="store.getProgress(poem.id).understood ? 'bg-bamboo' : 'bg-black/10'"></span>
                  <span class="w-2.5 h-2.5 rounded-full" :class="store.getProgress(poem.id).handwritten ? 'bg-gold' : 'bg-black/10'"></span>
                  <span class="w-2.5 h-2.5 rounded-full" :class="store.getProgress(poem.id).recited ? 'bg-cinnabar' : 'bg-black/10'"></span>
                </div>
                <div v-if="store.getProgress(poem.id).recited" class="seal seal-mini">已会</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `,
    store,
    navigate,
    level,
    poems,
    accentClass,
    bgClass
  };
}

export function render() {
  return `<div class="max-w-3xl mx-auto px-4 sm:px-6 pt-6" v-scope="LevelPage()"></div>`;
}

export function mount(container) {
  createApp({ LevelPage }).mount(container);
}
