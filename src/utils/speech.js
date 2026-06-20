export function speak(text) {
  if (!('speechSynthesis' in window)) {
    alert('您的浏览器不支持朗读功能');
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = 0.85;
  u.pitch = 1.05;
  window.speechSynthesis.speak(u);
}

export function speakLine(line) {
  speak(line);
}
