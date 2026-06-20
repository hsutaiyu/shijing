import { reactive } from 'petite-vue';
import * as db from './db.js';
import { loadPoems, getLevels } from './api.js';

export const store = reactive({
  poems: [],
  levels: getLevels(),
  progress: {},
  stats: null,
  weakList: {},
  currentPage: 'home',
  currentLevel: 1,
  currentPoemId: null,
  reviewMode: 'sequence',
  reviewIndex: 0,
  initialized: false,

  async init() {
    if (this.initialized) return;
    const [poems, allProgress, stats, weakSet] = await Promise.all([
      loadPoems(),
      db.getAllProgress(),
      db.getStats(),
      db.getWeakList()
    ]);
    this.poems = poems;
    this.progress = allProgress;
    this.stats = this.updateStreak(stats);
    const weakObj = {};
    weakSet.forEach(id => weakObj[id] = true);
    this.weakList = weakObj;
    this.initialized = true;
  },

  updateStreak(stats) {
    const today = new Date().toISOString().split('T')[0];
    const last = stats.lastOpen;
    if (!last) {
      stats.lastOpen = today;
      stats.streakDays = 1;
    } else if (last !== today) {
      const lastDate = new Date(last + 'T00:00:00');
      const todayDate = new Date(today + 'T00:00:00');
      const diff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        stats.streakDays = (stats.streakDays || 0) + 1;
      } else if (diff > 1) {
        stats.streakDays = 1;
      }
      stats.lastOpen = today;
    }
    stats.totalRecited = this.totalProgress.recited;
    db.setStats(stats);
    return stats;
  },

  getProgress(poemId) {
    return this.progress[poemId] || { poemId, understood: false, handwritten: false, recited: false, lastReviewed: null };
  },

  async toggleProgress(poemId, field) {
    const current = this.getProgress(poemId)[field];
    const updated = await db.setProgress(poemId, field, !current);
    this.progress[poemId] = updated;
    this.stats.totalRecited = this.totalProgress.recited;
    await db.setStats(this.stats);
    return { field, value: !current, updated };
  },

  async markWeak(poemId, isWeak) {
    if (isWeak) {
      this.weakList[poemId] = true;
      await db.addWeak(poemId);
    } else {
      delete this.weakList[poemId];
      await db.removeWeak(poemId);
    }
  },

  async resetAll() {
    await db.clearAllData();
    const today = new Date().toISOString().split('T')[0];
    this.progress = {};
    this.weakList = new Set();
    this.stats = { key: 'main', firstOpen: today, lastOpen: today, streakDays: 1, totalRecited: 0 };
    await db.setStats(this.stats);
  },

  async importData(data) {
    if (data.progress) {
      this.progress = data.progress;
      for (const poemId in data.progress) {
        await db.setProgress(Number(poemId), 'understood', data.progress[poemId].understood);
        await db.setProgress(Number(poemId), 'handwritten', data.progress[poemId].handwritten);
        await db.setProgress(Number(poemId), 'recited', data.progress[poemId].recited);
      }
    }
    if (data.stats) {
      this.stats = data.stats;
      await db.setStats(this.stats);
    }
    if (data.weakList) {
      const weakObj = {};
      data.weakList.forEach(id => weakObj[id] = true);
      this.weakList = weakObj;
      for (const poemId of data.weakList) {
        await db.addWeak(poemId);
      }
    }
  },

  get levelProgress() {
    const map = {};
    for (const lvl of this.levels) {
      const poems = this.poems.filter(p => p.level === lvl.id);
      const understood = poems.filter(p => this.getProgress(p.id).understood).length;
      const handwritten = poems.filter(p => this.getProgress(p.id).handwritten).length;
      const recited = poems.filter(p => this.getProgress(p.id).recited).length;
      map[lvl.id] = { total: poems.length, understood, handwritten, recited };
    }
    return map;
  },

  get totalProgress() {
    const recited = this.poems.filter(p => this.getProgress(p.id).recited).length;
    return { total: this.poems.length, recited };
  },

  get todayPoem() {
    const unrecited = this.poems.filter(p => !this.getProgress(p.id).recited);
    if (unrecited.length === 0) return this.poems[Math.floor(Math.random() * this.poems.length)];
    const today = new Date().toISOString().split('T')[0];
    const seed = Number(today.replace(/-/g, ''));
    return unrecited[seed % unrecited.length];
  },

  get dailyQuote() {
    const recited = this.poems.filter(p => this.getProgress(p.id).recited);
    if (recited.length === 0) return null;
    const today = new Date().toISOString().split('T')[0];
    const seed = Number(today.replace(/-/g, ''));
    const poem = recited[seed % recited.length];
    return {
      text: poem.content[Math.floor(seed / 100) % poem.content.length],
      poem
    };
  },

  get recitedPoems() {
    return this.poems.filter(p => this.getProgress(p.id).recited);
  }
});
