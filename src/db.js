import { openDB } from 'idb';

const DB_NAME = 'shijing';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'poemId' });
      }
      if (!db.objectStoreNames.contains('stats')) {
        db.createObjectStore('stats', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('weak')) {
        db.createObjectStore('weak', { keyPath: 'poemId' });
      }
    }
  });
}

const dbPromise = initDB();

export async function getProgress(poemId) {
  const db = await dbPromise;
  const row = await db.get('progress', poemId);
  return row || { poemId, understood: false, handwritten: false, recited: false, lastReviewed: null };
}

export async function setProgress(poemId, field, value) {
  const db = await dbPromise;
  const row = await getProgress(poemId);
  row[field] = value;
  if (value) {
    row.lastReviewed = new Date().toISOString().split('T')[0];
  }
  await db.put('progress', row);
  return row;
}

export async function getAllProgress() {
  const db = await dbPromise;
  const rows = await db.getAll('progress');
  const map = {};
  rows.forEach(row => { map[row.poemId] = row; });
  return map;
}

export async function getStats() {
  const db = await dbPromise;
  const row = await db.get('stats', 'main');
  if (!row) {
    const today = new Date().toISOString().split('T')[0];
    return { key: 'main', firstOpen: today, lastOpen: today, streakDays: 1, totalRecited: 0 };
  }
  return row;
}

export async function setStats(stats) {
  const db = await dbPromise;
  await db.put('stats', stats);
}

export async function getWeakList() {
  const db = await dbPromise;
  const rows = await db.getAll('weak');
  const set = new Set();
  rows.forEach(r => { if (r.active) set.add(r.poemId); });
  return set;
}

export async function addWeak(poemId) {
  const db = await dbPromise;
  await db.put('weak', { poemId, active: true });
}

export async function removeWeak(poemId) {
  const db = await dbPromise;
  await db.put('weak', { poemId, active: false });
}

export async function clearAllData() {
  const db = await dbPromise;
  await db.clear('progress');
  await db.clear('stats');
  await db.clear('weak');
}
