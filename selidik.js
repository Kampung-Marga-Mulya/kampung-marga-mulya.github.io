const { chromium } = require('playwright');
const fs = require('fs');
fs.mkdirSync('hasil', { recursive: true });
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const log = []; let n = 0;
  p.on('response', async (r) => {
    const u = r.url(), ct = r.headers()['content-type'] || '';
    const e = { url: u, method: r.request().method(), status: r.status(), ct, post: r.request().postData() || null, hal: p.url() };
    log.push(e);
    if (/\.(png|jpe?g|webp|svg|woff2?|css|ico|gif)(\?|$)/i.test(u)) return;
    if (/json|text\/plain|csv/.test(ct) || (/html/.test(ct) && /action=|api|ajax|data/i.test(u))) {
      try { const t = await r.text(); e.ukuran = t.length; n++; fs.writeFileSync('hasil/r' + String(n).padStart(3, '0') + '.txt', u + '\n' + (e.post || '') + '\n\n' + t.slice(0, 300000)); } catch (x) {}
    } else if (/javascript/.test(ct) && !/cdn|unpkg|jquery|tailwind|elementor|wp-includes|leaflet/i.test(u)) {
      try { const t = await r.text(); fs.writeFileSync('hasil/js_' + u.replace(/[^a-z0-9]+/gi, '_').slice(-90) + '.js', t); } catch (x) {}
    }
  });
  const halaman = ['https://pat.cwssibu.org/dashboard/aws-pat1', 'https://pat.cwssibu.org/', 'https://hpt.sinaubumi.org/', 'https://kat.sinaubumi.org/', 'https://fwi.sinaubumi.org/', 'https://dbd.sinaubumi.org/'];
  for (const u of halaman) {
    const k = u.replace(/https:\/\//, '').replace(/[^a-z0-9]+/gi, '_');
    try { await p.goto(u, { waitUntil: 'networkidle', timeout: 60000 }); } catch (x) { log.push({ err: String(x).slice(0, 300), u }); }
    await p.waitForTimeout(7000);
    try {
      fs.writeFileSync('hasil/page_' + k + '.html', await p.content());
      await p.screenshot({ path: 'hasil/shot_' + k + '.png', fullPage: true });
      fs.writeFileSync('hasil/text_' + k + '.txt', await p.evaluate(() => document.body.innerText));
      const ui = await p.evaluate(() => [...document.querySelectorAll('select, input, button, a[href]')].map(e => e.tagName + ' ' + (e.name || e.id || '') + ' ' + (e.getAttribute('href') || '') + ' ' + (e.textContent || '').trim().slice(0, 60) + (e.tagName === 'SELECT' ? ' OPTS:' + [...e.options].map(o => o.value + '=' + o.text).join('|').slice(0, 3000) : '')).slice(0, 300));
      fs.writeFileSync('hasil/ui_' + k + '.txt', ui.join('\n'));
    } catch (x) {}
  }
  fs.writeFileSync('hasil/network.json', JSON.stringify(log, null, 1));
  await b.close();
})();
