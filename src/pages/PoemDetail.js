import { createApp } from 'petite-vue';
import { store } from '../store.js';
import { navigate } from '../router.js';
import { Accordion } from '../components/Accordion.js';
import { speak, speakLine } from '../utils/speech.js';
import { spawnParticles, stampSeal, confetti } from '../utils/animations.js';

function PoemDetail() {
  const poem = store.poems.find(p => p.id === store.currentPoemId);
  const level = store.levels.find(l => l.id === poem.level);
  const ids = store.poems.map(p => p.id);
  const idx = ids.indexOf(poem.id);
  const prevId = idx > 0 ? ids[idx - 1] : null;
  const nextId = idx < ids.length - 1 ? ids[idx + 1] : null;

  const notesHtml = Object.entries(poem.notes || {}).map(([word, note]) => `
    <div class="inline-flex items-start gap-2 bg-gold-light rounded-xl px-3 py-2 mr-2 mb-2">
      <span class="font-bold text-gold font-wenkai whitespace-nowrap">${word}</span>
      <span class="text-sm text-ink-light">${note}</span>
    </div>
  `).join('');

  async function toggleProgress(field) {
    if (field === 'handwritten' && !store.getProgress(poem.id).handwritten) {
      if (!confirm('请在纸上默写这首诗，写完后点击确认。')) return;
    }
    const result = await store.toggleProgress(poem.id, field);
    const btn = document.getElementById(`btn-${field}-${poem.id}`);
    if (btn) {
      const rect = btn.getBoundingClientRect();
      spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, field);
    }
    if (result.value && field === 'recited') {
      stampSeal();
      checkLevelComplete();
    }
  }

  function checkLevelComplete() {
    const poems = store.poems.filter(p => p.level === poem.level);
    const allRecited = poems.every(p => store.getProgress(p.id).recited);
    if (allRecited) {
      confetti();
      setTimeout(() => {
        alert(`🎉 恭喜通关 Level ${poem.level} · ${level.name}！`);
      }, 300);
    }
  }

  function highlightLine(el) {
    document.querySelectorAll('.poem-line').forEach(l => l.classList.remove('recite-highlight'));
    el.classList.add('recite-highlight');
  }

  function speakPoem() {
    speak(`${poem.title}，${poem.dynasty} ${poem.author}。${poem.content.join('')}`);
  }

  return {
    $template: `
      <div class="page pb-24">
        <header class="flex items-center justify-between mb-6">
          <button @click="navigate('level', {level: poem.level})" class="p-2 rounded-xl hover:bg-black/5 transition-colors">
            <svg class="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <div class="text-center">
            <p class="text-xs text-ink-light">Level {{ poem.level }} · {{ level.name }}</p>
          </div>
          <button @click="speakPoem" class="p-2 rounded-xl hover:bg-black/5 transition-colors" title="朗读全诗">
            <svg class="w-6 h-6 text-ink-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
          </button>
        </header>

        <div class="bg-paper-dark rounded-[24px] shadow-card border border-black/[0.04] overflow-hidden mb-6">
          <div class="scroll-top mx-4 mt-4"></div>
          <div class="p-6 sm:p-8">
            <div class="text-center mb-8">
              <h1 class="text-4xl sm:text-5xl font-bold text-ink font-wenkai mb-3">{{ poem.title }}</h1>
              <div class="flex items-center justify-center gap-2 text-sm flex-wrap">
                <span class="px-3 py-1 rounded-full bg-cinnabar-light text-cinnabar font-medium">{{ poem.dynasty }}</span>
                <span class="text-ink-light">{{ poem.author }}</span>
                <span class="px-3 py-1 rounded-full bg-black/5 text-ink-light text-xs">{{ poem.tags?.join(' · ') || '' }}</span>
              </div>
            </div>

            <div class="space-y-4 mb-8">
              <div v-for="(line, i) in poem.content" :key="i" @click="highlightLine($el)"
                class="poem-line group flex items-center justify-center gap-3 py-2 rounded-xl hover:bg-black/[0.02] transition-colors cursor-pointer">
                <p class="text-2xl sm:text-[28px] text-ink font-wenkai text-center leading-relaxed tracking-widest">{{ line }}</p>
                <button @click.stop="speakLine(line)" class="recite-btn w-8 h-8 rounded-full bg-gold-light text-gold flex items-center justify-center hover:bg-gold hover:text-white transition-colors flex-shrink-0" title="朗读此句">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path></svg>
                </button>
              </div>
            </div>
          </div>
          <div class="scroll-bottom mx-4 mb-4"></div>
        </div>

        <div class="space-y-4 mb-8">
          <div v-scope="Accordion({ title: '注释', content: notesHtml, open: true })"></div>
          <div v-scope="Accordion({ title: '译文', content: translationHtml, open: true })"></div>
          <div v-scope="Accordion({ title: '背诵技巧', content: tipsHtml, open: true })"></div>
        </div>

        <div class="bg-paper-dark rounded-[20px] shadow-card p-5 border border-black/[0.04] mb-6">
          <h3 class="text-base font-bold text-ink mb-4 font-wenkai text-center">学习进度</h3>
          <div class="grid grid-cols-3 gap-3">
            <button :id="'btn-understood-' + poem.id" @click="toggleProgress('understood')"
              class="btn-ripple relative py-3 px-2 rounded-xl border-2 transition-all font-medium text-sm"
              :class="store.getProgress(poem.id).understood ? 'bg-bamboo text-white border-transparent shadow-lg' : 'bg-paper border-bamboo text-bamboo hover:bg-black/[0.02]'">
              <span class="flex items-center justify-center gap-1">
                <svg v-if="store.getProgress(poem.id).understood" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                我理解了
              </span>
            </button>
            <button :id="'btn-handwritten-' + poem.id" @click="toggleProgress('handwritten')"
              class="btn-ripple relative py-3 px-2 rounded-xl border-2 transition-all font-medium text-sm"
              :class="store.getProgress(poem.id).handwritten ? 'bg-gold text-white border-transparent shadow-lg' : 'bg-paper border-gold text-gold hover:bg-black/[0.02]'">
              <span class="flex items-center justify-center gap-1">
                <svg v-if="store.getProgress(poem.id).handwritten" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                已手写
              </span>
            </button>
            <button :id="'btn-recited-' + poem.id" @click="toggleProgress('recited')"
              class="btn-ripple relative py-3 px-2 rounded-xl border-2 transition-all font-medium text-sm"
              :class="store.getProgress(poem.id).recited ? 'bg-cinnabar text-white border-transparent shadow-lg' : 'bg-paper border-cinnabar text-cinnabar hover:bg-black/[0.02]'">
              <span class="flex items-center justify-center gap-1">
                <svg v-if="store.getProgress(poem.id).recited" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                已背下
              </span>
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center gap-4">
          <button @click="prevId ? navigate('detail', {poemId: prevId}) : navigate('level', {level: poem.level})" class="flex-1 py-3 rounded-xl border border-ink/20 text-ink hover:bg-black/5 transition-colors font-medium">
            {{ prevId ? '上一首' : '返回列表' }}
          </button>
          <button @click="nextId ? navigate('detail', {poemId: nextId}) : navigate('level', {level: poem.level})" class="flex-1 py-3 rounded-xl bg-ink text-white hover:bg-ink/90 transition-colors font-medium">
            {{ nextId ? '下一首' : '返回列表' }}
          </button>
        </div>
      </div>
    `,
    store,
    navigate,
    poem,
    level,
    prevId,
    nextId,
    notesHtml,
    translationHtml: `<p class="text-ink leading-relaxed">${poem.translation}</p>`,
    tipsHtml: `
      <div class="flex items-start gap-3 bg-bamboo-light rounded-xl p-4">
        <svg class="w-5 h-5 text-bamboo flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
        <p class="text-ink leading-relaxed">${poem.tips}</p>
      </div>
    `,
    Accordion,
    toggleProgress,
    highlightLine,
    speakPoem,
    speakLine
  };
}

export function render() {
  return `<div class="max-w-3xl mx-auto px-4 sm:px-6 pt-6" v-scope="PoemDetail()"></div>`;
}

export function mount(container) {
  createApp({ PoemDetail, Accordion }).mount(container);
}
