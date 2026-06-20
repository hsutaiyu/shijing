import { createApp } from 'petite-vue';
import { store } from '../store.js';
import { navigate } from '../router.js';
import { PandaLogo } from '../components/PandaLogo.js';

function ReviewPage() {
  let revealed = false;

  function currentPoem() {
    const recited = store.recitedPoems;
    if (recited.length === 0) return null;
    if (store.reviewMode === 'random') {
      const seed = Date.now() % recited.length;
      return recited[seed];
    }
    store.reviewIndex = Math.max(0, Math.min(store.reviewIndex, recited.length - 1));
    return recited[store.reviewIndex];
  }

  function weakCount() {
    return Object.keys(store.weakList).length;
  }

  async function mark(result) {
    const poem = currentPoem();
    if (!poem) return;
    if (result === 'fuzzy' || result === 'forget') {
      await store.markWeak(poem.id, true);
    } else {
      await store.markWeak(poem.id, false);
    }
    revealed = false;
    if (store.reviewMode === 'sequence') {
      next();
    }
  }

  function next() {
    const recited = store.recitedPoems;
    store.reviewIndex = (store.reviewIndex + 1) % recited.length;
    revealed = false;
  }

  function prev() {
    const recited = store.recitedPoems;
    store.reviewIndex = (store.reviewIndex - 1 + recited.length) % recited.length;
    revealed = false;
  }

  function setMode(mode) {
    store.reviewMode = mode;
    store.reviewIndex = 0;
    revealed = false;
  }

  function reveal() {
    revealed = true;
  }

  return {
    $template: `
      <div class="page pb-24">
        <header class="flex items-center gap-4 mb-6">
          <div v-scope="PandaLogo({ size: 56 })"></div>
          <div>
            <h1 class="text-2xl font-bold text-ink font-wenkai">复习抽背</h1>
            <p class="text-sm text-ink-light">已背诵 {{ store.recitedPoems.length }} 首 · 需加强 {{ weakCount() }} 首</p>
          </div>
        </header>

        <div v-if="!currentPoem()" class="text-center py-20">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-light flex items-center justify-center text-gold">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <h2 class="text-xl font-bold text-ink mb-2 font-wenkai">还没有已背诵的诗</h2>
          <p class="text-ink-light mb-6">先去学习几首，再来复习吧</p>
          <button @click="navigate('home')" class="px-8 py-3 rounded-xl bg-cinnabar text-white font-medium hover:bg-cinnabar/90 transition-colors">去学习</button>
        </div>

        <template v-else>
          <section class="bg-paper-dark rounded-[20px] shadow-card p-4 border border-black/[0.04] mb-6">
            <div class="flex gap-2">
              <button @click="setMode('sequence')" class="flex-1 py-2 rounded-xl text-sm font-medium transition-colors" :class="store.reviewMode === 'sequence' ? 'bg-cinnabar text-white' : 'bg-black/5 text-ink-light hover:bg-black/10'">顺序复习</button>
              <button @click="setMode('random')" class="flex-1 py-2 rounded-xl text-sm font-medium transition-colors" :class="store.reviewMode === 'random' ? 'bg-cinnabar text-white' : 'bg-black/5 text-ink-light hover:bg-black/10'">随机抽背</button>
            </div>
          </section>

          <section class="bg-paper-dark rounded-[24px] shadow-card border border-black/[0.04] p-8 text-center mb-6">
            <div class="scroll-top mx-2 mb-6"></div>
            <p class="text-sm text-ink-light mb-3">请在心里背诵这首诗</p>
            <h2 class="text-4xl font-bold text-ink mb-3 font-wenkai">{{ currentPoem().title }}</h2>
            <p class="text-ink-light mb-8">{{ currentPoem().dynasty }} · {{ currentPoem().author }}</p>

            <div v-if="revealed" class="mb-8">
              <div class="bg-gold-light/50 rounded-[16px] p-5 mb-4">
                <p v-for="line in currentPoem().content" :key="line" class="text-xl text-ink font-wenkai leading-loose">{{ line }}</p>
              </div>
              <p class="text-sm text-ink-light leading-relaxed text-left">{{ currentPoem().translation }}</p>
            </div>

            <button v-if="!revealed" @click="reveal" class="w-full py-3 rounded-xl bg-gold text-white font-medium hover:bg-gold/90 transition-colors mb-4">展开原文核对</button>

            <div v-if="revealed" class="grid grid-cols-3 gap-3">
              <button @click="mark('remember')" class="py-3 rounded-xl bg-bamboo text-white font-medium hover:bg-bamboo/90 transition-colors">记得</button>
              <button @click="mark('fuzzy')" class="py-3 rounded-xl bg-gold text-white font-medium hover:bg-gold/90 transition-colors">模糊</button>
              <button @click="mark('forget')" class="py-3 rounded-xl bg-cinnabar text-white font-medium hover:bg-cinnabar/90 transition-colors">忘记</button>
            </div>
          </section>

          <div v-if="store.reviewMode === 'sequence'" class="flex justify-between items-center gap-4">
            <button @click="prev" class="flex-1 py-3 rounded-xl border border-ink/20 text-ink hover:bg-black/5 transition-colors">上一首</button>
            <button @click="next" class="flex-1 py-3 rounded-xl bg-ink text-white hover:bg-ink/90 transition-colors">下一首</button>
          </div>
          <button v-else @click="revealed = false" class="w-full py-3 rounded-xl bg-ink text-white hover:bg-ink/90 transition-colors font-medium">换一首</button>
        </template>
      </div>
    `,
    store,
    navigate,
    PandaLogo,
    currentPoem,
    weakCount,
    revealed,
    mark,
    next,
    prev,
    setMode,
    reveal
  };
}

export function render() {
  return `<div class="max-w-3xl mx-auto px-4 sm:px-6 pt-6" v-scope="ReviewPage()"></div>`;
}

export function mount(container) {
  createApp({ ReviewPage, PandaLogo }).mount(container);
}
