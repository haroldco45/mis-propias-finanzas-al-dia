// Robot de Mis Propias Finanzas al Día — Vibras Positivas HM
// Corre en GitHub Actions cada 30 minutos: trae los videos reales del canal (RSS de YouTube)
// y las noticias (Google News), actualiza data.json y la foto de vista previa og.jpg.
import { readFile, writeFile } from 'node:fs/promises';

const CHANNEL_ID = 'UCEK0oX3X2yK9y27khCsrNKg';
const YT = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const NEWS = 'https://news.google.com/rss/search?q=%22Mis+Propias+Finanzas%22+OR+%22Carolina+Pineda%22+finanzas+OR+%22Juan+Pablo+Zuluaga%22+finanzas&hl=es-419&gl=CO&ceid=CO:es-419';
const UA = { 'User-Agent': 'Mozilla/5.0 (VibrasPositivasHM robot)' };

const dec = s => (s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
const tag = (xml, t) => { const m = xml.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? dec(m[1]) : ''; };

async function get(url) {
  for (let i = 0; i < 3; i++) {
    try { const r = await fetch(url, { headers: UA }); if (r.ok) return await r.text(); } catch (e) {}
    await new Promise(r => setTimeout(r, 2000 * (i + 1)));
  }
  return null;
}

async function main() {
  let data = { videos: [], news: [] };
  try { data = JSON.parse(await readFile('data.json', 'utf8')); } catch (e) {}

  const y = await get(YT);
  if (y) {
    const vids = [...y.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => {
      const views = e.match(/<media:statistics views="(\d+)"/);
      return { id: tag(e, 'yt:videoId'), title: tag(e, 'title'), published: tag(e, 'published'),
               description: tag(e, 'media:description'), views: views ? +views[1] : null };
    }).filter(v => v.id);
    const m = new Map((data.videos || []).map(v => [v.id, v]));
    vids.forEach(v => m.set(v.id, { ...m.get(v.id), ...v }));
    data.videos = [...m.values()].sort((a, b) => new Date(b.published) - new Date(a.published)).slice(0, 80);
    console.log('videos:', vids.length, 'total:', data.videos.length);
  } else console.log('YouTube RSS no respondió');

  const n = await get(NEWS);
  if (n) {
    const items = [...n.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, i]) => {
      const source = tag(i, 'source'); let title = tag(i, 'title');
      if (source && title.endsWith(' - ' + source)) title = title.slice(0, -(source.length + 3));
      return { title, url: tag(i, 'link'), date: new Date(tag(i, 'pubDate')).toISOString(), source };
    }).filter(x => x.title && x.url);
    const m = new Map((data.news || []).map(x => [x.url, x]));
    items.forEach(x => m.set(x.url, x));
    data.news = [...m.values()].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 60);
    console.log('noticias:', items.length);
  } else console.log('Google News no respondió');

  // Foto real para la vista previa del enlace: miniatura del último video
  const last = data.videos?.[0];
  if (last && data.ogVideo !== last.id) {
    for (const q of ['maxresdefault', 'sddefault', 'hqdefault']) {
      try {
        const r = await fetch(`https://i.ytimg.com/vi/${last.id}/${q}.jpg`);
        if (r.ok) { const b = Buffer.from(await r.arrayBuffer()); if (b.length > 8000) { await writeFile('og.jpg', b); data.ogVideo = last.id; console.log('og.jpg ←', q); break; } }
      } catch (e) {}
    }
  }

  data.updated = new Date().toISOString();
  await writeFile('data.json', JSON.stringify(data, null, 1));
}
main();
