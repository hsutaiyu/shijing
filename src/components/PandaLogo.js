import { speak } from '../utils/speech.js';

export function PandaLogo({ size = 56 } = {}) {
  return {
    $template: `
      <img src="./panda.png" alt="古诗研习录吉祥物"
        class="rounded-full object-cover shadow-float hover:scale-105 active:scale-95 transition-transform cursor-pointer bg-paper-dark"
        :style="{ width: size + 'px', height: size + 'px' }"
        @click="onClick">
    `,
    size,
    onClick() {
      speak('古诗研习录，让我们一起学古诗吧');
    }
  };
}
