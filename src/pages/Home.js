import { createApp } from 'petite-vue';
import { store } from '../store.js';
import { navigate } from '../router.js';
import { PandaLogo } from '../components/PandaLogo.js';
import { ProgressRing } from '../components/ProgressRing.js';

function HomePage() {
  const accentClass = { cinnabar: 'text-cinnabar', bamboo: 'text-bamboo', gold: 'text-gold', plum: 'text-plum-ink' };
  const bgClass = { cinnabar: 'bg-cinnabar-light', bamboo: 'bg-bamboo-light', gold: 'bg-gold-light', plum: 'bg-plum' };

  return {
    $template: `
      <div class="page pb-8">
        <header class="flex items-center gap-4 mb-8">
          <div v-scope="PandaLogo({ size: 64 })"></div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-ink font-wenkai">古诗研习录</h1>
            <p class="text-sm text-ink-light">每天一首，循序渐进</p>
          </div>
        </header>

        <section class="bg-paper-dark rounded-[20px] shadow-card p-6 mb-6 border border-black/[0.04]">
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <div v-scope="ProgressRing({ percent: totalPct, size: 160, stroke: 14 })"></div>
            <div class="flex-1 text-center sm:text-left">
              <p class="text-ink-light text-sm mb-1">总进度</p>
              <p class="text-3xl font-bold text-ink font-wenkai mb-2">{{ store.totalProgress.recited }} <span class="text-base font-normal text-ink-light">/ {{ store.totalProgress.total }} 首</span></p>
              <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span class="px-3 py-1 rounded-full text-xs bg-bamboo-light text-bamboo">连续 {{ store.stats.streakDays || 1 }} 天</span>
                <span class="px-3 py-1 rounded-full text-xs bg-gold-light text-gold">{{ store.dailyQuote ? '今日有复习' : '开始今日学习' }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-lg font-bold text-ink mb-4 font-wenkai flex items-center gap-2">
            <span class="w-1.5 h-5 bg-cinnabar rounded-full"></span>选择关卡
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="(lvl, i) in store.levels" :key="lvl.id" @click="navigate('level', {level: lvl.id})"
              class="stagger-item cursor-pointer rounded-[20px] p-5 shadow-card hover:shadow-float transition-all hover:-translate-y-1 border"
              :class="[bgClass[lvl.color], 'border-' + (lvl.color === 'plum' ? 'plum-ink' : lvl.color) + '/20']"
              :style="{ animationDelay: i * 50 + 'ms' }">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="text-lg font-bold font-wenkai" :class="accentClass[lvl.color]">Level {{ lvl.id }}</h3>
                  <p class="text-sm text-ink font-medium">{{ lvl.name }}</p>
                  <p class="text-xs text-ink-light mt-1">{{ lvl.desc }}</p>
                </div>
                <span class="text-2xl font-bold opacity-30" :class="accentClass[lvl.color]">{{ lvl.id }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex-1 progress-bar bg-black/5">
                  <div class="progress-bar-fill" :class="lvl.color === 'plum' ? 'bg-plum-ink' : 'bg-' + lvl.color" :style="{ width: (store.levelProgress[lvl.id].recited / store.levelProgress[lvl.id].total * 100) + '%' }"></div>
                </div>
                <span class="text-xs text-ink-light">{{ store.levelProgress[lvl.id].recited }}/{{ store.levelProgress[lvl.id].total }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-lg font-bold text-ink mb-4 font-wenkai flex items-center gap-2">
            <span class="w-1.5 h-5 bg-gold rounded-full"></span>今日推荐
          </h2>
          <div @click="navigate('detail', {poemId: store.todayPoem.id})" class="cursor-pointer bg-paper-dark rounded-[20px] shadow-card p-5 border border-black/[0.04] hover:shadow-float transition-all">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-cinnabar-light flex items-center justify-center text-cinnabar font-bold text-lg font-wenkai">今</div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-ink font-wenkai">{{ store.todayPoem.title }}</h3>
                <p class="text-sm text-ink-light">{{ store.todayPoem.dynasty }} · {{ store.todayPoem.author }}</p>
              </div>
              <svg class="w-5 h-5 text-ink-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
            <p class="mt-3 text-ink-light text-sm line-clamp-2">{{ store.todayPoem.content.join(' ') }}</p>
          </div>
        </section>

        <section v-if="store.dailyQuote" class="mb-20">
          <h2 class="text-lg font-bold text-ink mb-4 font-wenkai flex items-center gap-2">
            <span class="w-1.5 h-5 bg-bamboo rounded-full"></span>每日一句
          </h2>
          <div @click="navigate('detail', {poemId: store.dailyQuote.poem.id})" class="cursor-pointer bg-bamboo-light rounded-[20px] p-5 border border-bamboo/20">
            <p class="text-xl text-ink font-wenkai text-center mb-2">{{ store.dailyQuote.text }}</p>
            <p class="text-center text-sm text-ink-light">— {{ store.dailyQuote.poem.title }} · {{ store.dailyQuote.poem.author }}</p>
          </div>
        </section>
      </div>
    `,
    store,
    navigate,
    PandaLogo,
    ProgressRing,
    accentClass,
    bgClass,
    get totalPct() {
      const t = store.totalProgress;
      return t.total > 0 ? (t.recited / t.total) * 100 : 0;
    }
  };
}

export function render() {
  return `<div class="max-w-3xl mx-auto px-4 sm:px-6 pt-6" v-scope="HomePage()"></div>`;
}

export function mount(container) {
  createApp({ HomePage, PandaLogo, ProgressRing }).mount(container);
}
