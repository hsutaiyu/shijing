import { createApp } from 'petite-vue';
import { store } from './store.js';
import { navigate } from './router.js';
import './styles/base.css';

// Apply theme early to avoid flash
const savedTheme = localStorage.getItem('shijing-theme') || 'light';
document.documentElement.dataset.theme = savedTheme;

window.navigate = navigate;
window.store = store;

const app = createApp({
  store,
  navigate
});

window.petiteApp = app;

async function init() {
  await store.init();
  await navigate('home');

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

init();
