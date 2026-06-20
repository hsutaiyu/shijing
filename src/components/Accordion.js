export function Accordion({ title, content, open = true } = {}) {
  return {
    $template: `
      <div class="bg-paper-dark rounded-[16px] shadow-card border border-black/[0.04] overflow-hidden">
        <button @click="open = !open" class="w-full flex items-center justify-between p-4 text-left hover:bg-black/[0.02] transition-colors">
          <h3 class="text-base font-bold text-ink font-wenkai">{{ title }}</h3>
          <span class="accordion-arrow" :class="{ open: open }"></span>
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
