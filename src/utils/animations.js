export function spawnParticles(x, y, type) {
  const colors = { understood: '#6B9E75', handwritten: '#C9A86C', recited: '#D44A4A' };
  const container = document.getElementById('particle-container');
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.background = colors[type];
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    const angle = (Math.PI * 2 * i) / 12;
    const dist = 40 + Math.random() * 60;
    p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    container.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
}

export function stampSeal() {
  const seal = document.createElement('div');
  seal.className = 'seal fixed top-1/2 left-1/2 z-[9999] text-xl';
  seal.textContent = '已会';
  seal.style.transform = 'translate(-50%, -50%) scale(0) rotate(-6deg)';
  document.body.appendChild(seal);
  requestAnimationFrame(() => {
    seal.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s';
    seal.style.transform = 'translate(-50%, -50%) scale(1.5) rotate(-6deg)';
  });
  setTimeout(() => {
    seal.style.opacity = '0';
    seal.style.transform = 'translate(-50%, -50%) scale(2) rotate(-6deg)';
    setTimeout(() => seal.remove(), 400);
  }, 800);
}

export function confetti() {
  const colors = ['#D44A4A', '#6B9E75', '#C9A86C', '#8E6B8C', '#F7F3E9'];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.top = '-10px';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDelay = Math.random() * 0.8 + 's';
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3000);
  }
}

export function inkBlot() {
  const container = document.getElementById('ink-container');
  const blot = document.createElement('div');
  blot.className = 'ink-blot';
  const size = 200 + Math.random() * 200;
  blot.style.width = size + 'px';
  blot.style.height = size + 'px';
  blot.style.left = (Math.random() * window.innerWidth - size / 2) + 'px';
  blot.style.top = (Math.random() * window.innerHeight - size / 2) + 'px';
  container.appendChild(blot);
  setTimeout(() => blot.remove(), 1500);
}
