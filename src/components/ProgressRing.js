export function ProgressRing({ percent, size = 160, stroke = 14 } = {}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return {
    $template: `
      <div class="relative" :style="{ width: size + 'px', height: size + 'px' }">
        <svg class="progress-ring w-full h-full" style="transform: rotate(-90deg)">
          <circle :cx="size/2" :cy="size/2" :r="radius" fill="none" stroke="rgba(0,0,0,0.06)" :stroke-width="stroke"></circle>
          <circle :cx="size/2" :cy="size/2" :r="radius" fill="none" stroke="#D44A4A" :stroke-width="stroke" stroke-linecap="round"
            :stroke-dasharray="circumference" :stroke-dashoffset="offset"></circle>
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-3xl font-bold text-ink font-wenkai">{{ Math.round(percent) }}%</span>
          <span class="text-xs text-ink-light mt-1">已背诵</span>
        </div>
      </div>
    `,
    percent,
    size,
    stroke,
    radius,
    circumference,
    offset
  };
}
