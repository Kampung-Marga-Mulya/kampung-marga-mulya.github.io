const { chromium } = require('playwright');
const fs = require('fs');
fs.mkdirSync('hasil', { recursive: true });
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const log = [];
  p.on('response', async (r) => {
    const u = r.url(), ct = r.headers()['content-type'] || '';
    const e = { url: u, method: r.request().method(), status: r.status(), ct, post: r.request().postData() || null };
    log.push(e);
    if (/json|text\/plain|csv/.test(ct) || /api|json|data|station|aws/i.test(u) && !/\.(png|jpg|webp|svg|woff2?|css)(\?|$)/.test(u)) {
      try { const t = await r.text(); e.ukuran = t.length; fs.writeFileSync('hasil/r' + String(log.length).padStart(3, '0') + '.txt', u + '\n' + (e.post || '') + '\n\n' + t.slice(0, 400000)); } catch (x) {}
    }
    if (/\.js(\?|$)/.test(u)) { try { const t = await r.text(); fs.writeFileSync('hasil/js_' + u.replace(/[^a-z0-9]+/gi, '_').slice(-80) + '.js', t); } catch (x) {} }
  });
  for (const u of ['https://map.sinaubumi.org/', 'https://sinaubumi.org/']) {
    try { await p.goto(u, { waitUntil: 'networkidle', timeout: 60000 }); } catch (x) { log.push({ err: String(x), u }); }
    await p.waitForTimeout(6000);
    fs.writeFileSync('hasil/page_' + u.replace(/[^a-z]+/g, '_') + '.html', await p.content());
    await p.screenshot({ path: 'hasil/shot_' + u.replace(/[^a-z]+/g, '_') + '.png' });
    const teks = await p.evaluate(() => document.body.innerText);
    fs.writeFileSync('hasil/text_' + u.replace(/[^a-z]+/g, '_') + '.txt', teks);
  }
  // cari Waninggap / Merauke di map
  try {
    await p.goto('https://map.sinaubumi.org/', { waitUntil: 'networkidle', timeout: 60000 }); await p.waitForTimeout(5000);
    const kandidat = await p.evaluate(() => [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /waninggap|merauke|semangga/i.test(e.textContent)).map(e => e.outerHTML.slice(0, 300)).slice(0, 50));
    fs.writeFileSync('hasil/kandidat.json', JSON.stringify(kandidat, null, 1));
    const ins = await p.$$('input, select');
    fs.writeFileSync('hasil/inputs.json', JSON.stringify(await Promise.all(ins.map(i => i.evaluate(e => e.outerHTML.slice(0, 400)))), null, 1));
  } catch (x) {}
  fs.writeFileSync('hasil/network.json', JSON.stringify(log, null, 1));
  await b.close();
})();
