import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

function startServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn('python3', ['-m', 'http.server', '4173'], {
      cwd: 'dist',
      stdio: 'ignore'
    });
    setTimeout(() => resolve(proc), 1000);
  });
}

async function run() {
  const server = await startServer();
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('requestfailed', (req) => {
    if (req.url().includes('favicon')) return;
    errors.push(`REQ_FAIL: ${req.url()} - ${req.failure()?.errorText}`);
  });
  page.on('response', (res) => {
    if (res.status() === 404 && !res.url().includes('favicon')) {
      errors.push(`404: ${res.url()}`);
    }
  });

  try {
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    const title = await page.$eval('h1', el => el.textContent).catch(() => null);
    const levelCards = await page.$$eval('.stagger-item', els => els.length);
    const hasPanda = await page.$eval('img[alt="古诗研习录吉祥物"]', el => el.src.includes('panda.png')).catch(() => false);

    console.log('Title:', title);
    console.log('Level cards:', levelCards);
    console.log('Has panda logo:', hasPanda);
    console.log('Errors:', errors.length ? errors : 'none');

    // 测试导航到 Level 1
    const firstCard = await page.$('.stagger-item');
    if (firstCard) {
      await firstCard.click();
      await new Promise(r => setTimeout(r, 800));
      const poemRows = await page.$$eval('.stagger-item', els => els.length);
      console.log('Poem rows in Level 1:', poemRows);

      // 测试进入第一首诗详情
      const firstPoem = await page.$('.stagger-item');
      if (firstPoem) {
        await firstPoem.click();
        await new Promise(r => setTimeout(r, 800));
        const detailTitle = await page.$eval('h1', el => el.textContent).catch(() => null);
        console.log('Detail poem title:', detailTitle);
      }
    }

    // 测试统计页
    await page.evaluate(() => window.navigate('stats'));
    await new Promise(r => setTimeout(r, 800));
    const statsTitle = await page.$eval('h1', el => el.textContent).catch(() => null);
    console.log('Stats page title:', statsTitle);

    // 测试复习页
    await page.evaluate(() => window.navigate('review'));
    await new Promise(r => setTimeout(r, 800));
    const reviewTitle = await page.$eval('h1', el => el.textContent).catch(() => null);
    console.log('Review page title:', reviewTitle);
  } catch (e) {
    console.error('Test failed:', e.message);
    errors.push(e.message);
  } finally {
    try { await browser.close(); } catch {}
    try { server.kill(); } catch {}
    console.log('Final errors:', errors);
    const code = errors.length ? 1 : 0;
    console.log('Exiting with code:', code);
    process.exit(code);
  }
}

run();
