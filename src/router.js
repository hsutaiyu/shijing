import { store } from './store.js';
import { inkBlot } from './utils/animations.js';

const routes = {
  home: () => import('./pages/Home.js'),
  level: () => import('./pages/LevelPage.js'),
  detail: () => import('./pages/PoemDetail.js'),
  stats: () => import('./pages/StatsPage.js'),
  review: () => import('./pages/ReviewPage.js')
};

export async function navigate(page, params = {}) {
  store.currentPage = page;
  if (params.level) store.currentLevel = params.level;
  if (params.poemId) store.currentPoemId = params.poemId;

  window.scrollTo({ top: 0, behavior: 'smooth' });
  inkBlot();

  const loader = routes[page] || routes.home;
  const module = await loader();
  const render = module.render || module.default;
  const container = document.getElementById('app');
  container.innerHTML = render();

  if (module.mount) {
    module.mount(container);
  }

  updateNav();
  setupScrollProgress();
}

function updateNav() {
  const nav = document.getElementById('bottom-nav');
  const showNav = ['home', 'stats', 'review'].includes(store.currentPage);
  nav.classList.toggle('hidden', !showNav);
  nav.innerHTML = `
    <div class="max-w-3xl mx-auto flex justify-around items-center py-2 px-4">
      <button aria-label="首页" onclick="window.navigate('home')" class="flex flex-col items-center gap-1 p-2 transition-colors ${store.currentPage === 'home' ? 'text-cinnabar' : 'text-ink-light'} hover:text-cinnabar">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span class="text-xs">首页</span>
      </button>
      <button aria-label="统计" onclick="window.navigate('stats')" class="flex flex-col items-center gap-1 p-2 transition-colors ${store.currentPage === 'stats' ? 'text-cinnabar' : 'text-ink-light'} hover:text-cinnabar">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        <span class="text-xs">统计</span>
      </button>
      <button aria-label="复习" onclick="window.navigate('review')" class="flex flex-col items-center gap-1 p-2 transition-colors ${store.currentPage === 'review' ? 'text-cinnabar' : 'text-ink-light'} hover:text-cinnabar">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
        <span class="text-xs">复习</span>
      </button>
    </div>
  `;
}

function setupScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) {
    const el = document.createElement('div');
    el.id = 'scroll-progress';
    el.className = 'scroll-progress';
    el.style.width = '0%';
    document.body.appendChild(el);
  }
  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    document.getElementById('scroll-progress').style.width = percent + '%';
  };
  window.removeEventListener('scroll', onScroll);
  window.addEventListener('scroll', onScroll);
}
