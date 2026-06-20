import { createApp } from 'petite-vue';
import { store } from './store.js';
import { navigate } from './router.js';
import './styles/base.css';

window.navigate = navigate;

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
