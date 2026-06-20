export function Accordion({ title, content, open = true } = {}) {
  return {
    $template: `
      <div class="bg-paper-dark rounded-[16px] shadow-card border border-black/[0.04] overflow-hidden">
        <button @click="open = !open" class="w-full flex items-center justify-between p-4 text-left hover:bg-black/[0.02] transition-colors">
          <h3 class="text-base font-bold text-ink font-wenkai">{{ title }}</h3>
          <svg width="20" height="20" class="text-ink-light transition-transform duration-300 flex-shrink-0" :class="{ 'rotate-180': open }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <div class="px-4 pb-4 transition-all duration-300 overflow-hidden" :style="{ maxHeight: open ? '1000px' : '0', opacity: open ? 1 : 0 }">
          <div v-html="content"></div>
        </div>
      </div>
    `,
    title,
    content,
    open
  };
}
