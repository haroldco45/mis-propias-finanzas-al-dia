/* Mis Propias Finanzas al Día — Vibras Positivas HM
   Hora siempre en Colombia (America/Bogota). */
const TZ = 'America/Bogota';
const CHANNEL_ID = 'UCEK0oX3X2yK9y27khCsrNKg';
const YT_RSS = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const NEWS_RSS = 'https://news.google.com/rss/search?q=%22Mis+Propias+Finanzas%22+OR+%22Carolina+Pineda%22+finanzas+OR+%22Juan+Pablo+Zuluaga%22+finanzas&hl=es-419&gl=CO&ceid=CO:es-419';
const PROXIES = [
  u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  u => `https://corsproxy.io/?url=${encodeURIComponent(u)}`
];
const EVENT_AT = new Date('2026-12-09T19:00:00-05:00');

let LANG = localStorage.getItem('mpf-lang') || 'es';
let DATA = { videos: [], news: [], updated: null };
let CAT = 'todos';

/* ---------------- Textos ES / EN ---------------- */
const T = {
  es: {},
  en: {
    sub:'Tracker · Vibras Positivas HM', refresh:'Refresh', live:'Live',
    heroP:'Everything Mis Propias Finanzas publishes, their advice turned into investing tools, and the news about the channel — up to date.',
    stV:'videos tracked', stT:'tips extracted', stU:'last check (Col)',
    ph:'Search videos, tips and news…', hoy:'Today',
    hoyL:'The latest from the channel and the media, newest first. Refreshes every time you open it.',
    evTag:'Free live class', evT:'2027 Challenge: the best financial year of your life', evD:'December 9 · 7:00 p.m. Colombia time', evB:'Sign up',
    vids:'Videos', vidsL:'Tap the photo to watch it right here. Each video’s tips flow into Tools automatically.',
    tools:'Investing tools', toolsShort:'Tools', toolsL:'Mis Propias Finanzas’ advice turned into tools you can use with your own money.',
    t8:'Smart card use', t8T:'Guide to using debit and credit cards well', t8L:'The card isn’t the problem: misuse is. Tap each part to open it, and at the end see what paying in installments costs you.',
    t8C:'One installment or several?', t8CL:'Enter the purchase, the installments and your bank’s rate (it’s on your statement). The legal cap is the default.',
    f10:'Purchase amount (COP)', f11:'Number of installments', f12:'Effective annual rate (%)',
    usNote:'Legal cap (usury rate) for consumer credit and cards in November 2026: 28.34% EA, certified by the Superfinanciera (Resolution 1707 of 2026). It changes every month.',
    gTag:'Guide', gP:'When to use each one, how to avoid interest, security and an installment calculator.', gB:'Open the guide',
    t1:'Key advice', t2:'My risk profile', t3:'Compound interest', t4:'Pay yourself first', t5:'Cash vs. inflation', t6:'Is it a scam?', t7:'Channel tips',
    t1L:'What Carolina and Juan Pablo keep repeating in interviews and on their podcast, in the order it makes sense to apply it.',
    t2L:'They insist your risk profile depends mostly on when you will need the money, not just your personality. Take it once per goal.',
    t3L:'How much your monthly investment could grow. The rate is your own assumption: no serious investment guarantees returns.',
    t4L:'As soon as you get paid, set aside your share for saving and investing first and live on the rest. Works for biweekly, monthly or commission pay.',
    t5L:'Idle money loses purchasing power. See what your saved money is really "worth" over the years.',
    t6L:'Before putting money into an "opportunity", tick what they promise you.',
    t7L:'The bot reads every new video and sorts it by topic. Tap one to see the video it came from.',
    f1:'Starting amount (COP)', f2:'Monthly contribution (COP)', f3:'Assumed yearly return (%)', f4:'Years',
    f5:'Monthly income (COP)', f6:'Share for you (%)', f7:'Fixed monthly expenses (COP)', f8:'Saved money (COP)', f9:'Yearly inflation (%)',
    infNote:'Colombia’s annual inflation as of October 2026: 6.30% (DANE, released Nov 9, 2026). Change it when new data comes out.',
    calc:'See result', sfc:'Check with the Financial Superintendency',
    disc:'Educational content. Not personalized financial advice. Before investing, check that the entity is supervised by Colombia’s Superintendencia Financiera.',
    news:'In the media', newsShort:'Media', newsL:'What the media say about Mis Propias Finanzas and its creators.',
    about:'About the channel', aboutShort:'Channel',
    aboutP:'Financial education platform created in 2019 by Carolina Pineda and Juan Pablo Zuluaga. They cover budgeting, investing, real estate, couples’ finances and financial education for kids. They also co-host the podcast "Finanzas en Voz Alta" with Portafolio.',
    web:'Website', indep:'Independent app made by Vibras Positivas HM to follow the channel. Not affiliated with Mis Propias Finanzas. Videos and photos belong to their authors and are shown from YouTube.',
    vph:'Want an app like this for your business or brand? Message us.'
  }
};
const L = {
  es:{ago:'hace', min:'min', h:'h', d:'días', now:'ahora', updated:'Actualizado', none:'Aún no hay nada nuevo hoy. Mira los videos recientes abajo.',
      video:'Video', news:'Medios', watch:'Ver video', days:'días', hours:'horas', mins:'min', secs:'seg', all:'Todos',
      refreshing:'Buscando lo más nuevo…', fresh:'Al día', offline:'Sin conexión: mostrando lo guardado', noRes:'Sin resultados',
      fromVideo:'Del video', es:'contenido original en español', newL:'NUEVO', source:'Fuente', ev0:'¡Es hoy!'},
  en:{ago:'', min:'min ago', h:'h ago', d:'days ago', now:'now', updated:'Updated', none:'Nothing new today yet. See recent videos below.',
      video:'Video', news:'Media', watch:'Watch video', days:'days', hours:'hours', mins:'min', secs:'sec', all:'All',
      refreshing:'Fetching the latest…', fresh:'Up to date', offline:'Offline: showing saved content', noRes:'No results',
      fromVideo:'From the video', es:'original content in Spanish', newL:'NEW', source:'Source', ev0:'It’s today!'}
};
const l = k => L[LANG][k];

/* ---------------- Consejos curados (parafraseados, con fuente) ---------------- */
const CURATED = [
  {n:'01', es:['¿Para qué estás invirtiendo?','Antes de escoger producto, define la meta y en cuánto tiempo la necesitas: corto, mediano o largo plazo. Cada meta lleva su propio portafolio.'],
           en:['What are you investing for?','Before picking a product, define the goal and when you will need it: short, medium or long term. Each goal gets its own portfolio.'],
   src:'Portafolio · Finanzas en Voz Alta, jul. 2026', url:'https://www.portafolio.co/mis-finanzas/ahorro/finanzas-en-voz-alta-como-invertir-y-evitar-que-el-colchon-se-siga-comiendo-su-dinero-498785'},
  {n:'02', es:['El riesgo lo pone el plazo','La misma persona puede ser conservadora con la plata del viaje de diciembre y más arriesgada con la de su jubilación. Para lo que necesitas pronto, poca volatilidad.'],
           en:['Time sets the risk','The same person can be conservative with December’s trip money and bolder with retirement money. For money you need soon, keep volatility low.'],
   src:'Portafolio · Finanzas en Voz Alta, jul. 2026', url:'https://www.portafolio.co/mis-finanzas/ahorro/finanzas-en-voz-alta-como-invertir-y-evitar-que-el-colchon-se-siga-comiendo-su-dinero-498785'},
  {n:'03', es:['Haz tu radiografía financiera','Conoce con exactitud tus ingresos, gastos y deudas, y arma un presupuesto antes de pensar en invertir.'],
           en:['Get your financial X-ray','Know your exact income, expenses and debts, and build a budget before thinking about investing.'],
   src:'La República, feb. 2026', url:'https://www.larepublica.co/finanzas-personales/los-cinco-habitos-financieros-que-marcan-la-diferencia-entre-ahorrar-e-invertir-bien-4322283'},
  {n:'04', es:['Págate primero','Cuando llegue el pago, lo primero que sale es tu ahorro e inversión; los demás gastos van después.'],
           en:['Pay yourself first','When your pay arrives, your saving and investing comes out first; everything else comes after.'],
   src:'La República, feb. 2026', url:'https://www.larepublica.co/finanzas-personales/los-cinco-habitos-financieros-que-marcan-la-diferencia-entre-ahorrar-e-invertir-bien-4322283'},
  {n:'05', es:['Automatiza y arma tu fondo de emergencia','Programa el ahorro para que ocurra antes de gastar, controla las compras por impulso y construye un fondo para imprevistos, solo o en pareja.'],
           en:['Automate and build an emergency fund','Schedule saving so it happens before spending, curb impulse buys and build a fund for the unexpected, alone or as a couple.'],
   src:'Portafolio · Finanzas en Voz Alta, nov. 2026', url:'https://www.portafolio.co/mis-finanzas/metodos-practicos-para-presupuestar-ahorrar-en-automatico-y-crear-tu-fondo-de-emergencia-505724'},
  {n:'06', es:['El colchón se come tu plata','Dejar el dinero quieto hace que pierda poder de compra. Invertir es la forma de pelearle a la inflación.'],
           en:['The mattress eats your money','Idle money loses purchasing power. Investing is how you fight inflation.'],
   src:'Portafolio · Finanzas en Voz Alta, jul. 2026', url:'https://www.portafolio.co/mis-finanzas/ahorro/finanzas-en-voz-alta-como-invertir-y-evitar-que-el-colchon-se-siga-comiendo-su-dinero-498785'},
  {n:'07', es:['Entiende antes de invertir','Conoce el producto y cómo funciona. Prefiere opciones con rentabilidad clara y comprensible.'],
           en:['Understand before you invest','Know the product and how it works. Prefer options with clear, understandable returns.'],
   src:'Portafolio jul. 2026 · La República feb. 2026', url:'https://www.portafolio.co/mis-finanzas/ahorro/finanzas-en-voz-alta-como-invertir-y-evitar-que-el-colchon-se-siga-comiendo-su-dinero-498785'},
  {n:'08', es:['¿Tú mismo o un fondo?','Decide si vas a manejar tu plata directamente o a través de fondos administrados por profesionales.'],
           en:['Yourself or a fund?','Decide whether you will manage your money directly or through professionally managed funds.'],
   src:'Portafolio · Finanzas en Voz Alta, jul. 2026', url:'https://www.portafolio.co/mis-finanzas/ahorro/finanzas-en-voz-alta-como-invertir-y-evitar-que-el-colchon-se-siga-comiendo-su-dinero-498785'},
  {n:'09', es:['Disciplina, no impulso','No reacciones a cada subida o bajada normal del mercado. Las decisiones impulsivas son las que más cuestan.'],
           en:['Discipline, not impulse','Don’t react to every normal market up or down. Impulsive decisions are the costliest.'],
   src:'Portafolio · Finanzas en Voz Alta, jul. 2026', url:'https://www.portafolio.co/mis-finanzas/ahorro/finanzas-en-voz-alta-como-invertir-y-evitar-que-el-colchon-se-siga-comiendo-su-dinero-498785'},
  {n:'10', es:['Si promete mucho y rápido, desconfía','Ningún producto garantiza ganancias muy por encima del mercado. Verifica que la plataforma esté vigilada por la Superfinanciera.'],
           en:['Big and fast promises? Be wary','No product guarantees gains far above the market. Check the platform is supervised by the Superfinanciera.'],
   src:'Portafolio · Finanzas en Voz Alta, jul. 2026', url:'https://www.portafolio.co/mis-finanzas/ahorro/finanzas-en-voz-alta-como-invertir-y-evitar-que-el-colchon-se-siga-comiendo-su-dinero-498785'},
  {n:'11', es:['Habla de plata en familia','El silencio sobre el dinero en casa termina costando caro. Que la familia sepa qué inversiones y bienes hay.'],
           en:['Talk money at home','Silence about money at home ends up costing a lot. Let your family know what investments and assets exist.'],
   src:'Portafolio · Finanzas en Voz Alta', url:'https://www.portafolio.co/mis-finanzas/ahorro/finanzas-en-voz-alta-hablar-de-dinero-sigue-siendo-un-tabu-en-los-hogares-y-eso-termina-rompiendo-familias-498108'},
  {n:'12', es:['Aprende siempre, de varias fuentes','La educación constante es la base: lee distintos puntos de vista y aprende a interpretar las noticias económicas.'],
           en:['Keep learning from many sources','Constant education is the foundation: read different viewpoints and learn to interpret economic news.'],
   src:'Portafolio · Finanzas en Voz Alta', url:'https://www.portafolio.co/mis-finanzas/ahorro/finanzas-en-voz-alta-como-los-habitos-financieros-marcan-la-diferencia-en-la-administracion-del-dinero-494018'}
];

/* ---------------- Clasificador de consejos (mismo que usa el robot) ---------------- */
const CATS = {
  presupuesto:{es:'Presupuesto y ahorro', en:'Budget & saving', k:['presupuest','ahorr','gasto','deuda','tarjeta','crédito','credito','quincena','sueldo','salario','prima','fondo de emergencia']},
  acciones:{es:'Acciones y ETF', en:'Stocks & ETFs', k:['acci','etf','s&p','bolsa','nasdaq','dividend','portafolio','broker','index']},
  rentafija:{es:'CDT y renta fija', en:'CDs & fixed income', k:['cdt','bono','renta fija','tasa','tes ','cuenta remunerada','fic','fondo de inversión','fondo de inversion']},
  finca:{es:'Finca raíz', en:'Real estate', k:['finca raíz','finca raiz','inmueble','apartamento','vivienda','arriendo','real estate','casa','lote','hipoteca']},
  cripto:{es:'Cripto', en:'Crypto', k:['bitcoin','cripto','crypto','blockchain','ethereum']},
  dolar:{es:'Dólar y mundo', en:'Dollar & world', k:['dólar','dolar','divisa','trump','economía mundial','economia mundial','inflación','inflacion','fed','recesión','recesion']},
  retiro:{es:'Pensión y libertad', en:'Retirement & freedom', k:['pensi','jubil','retiro','libertad financiera','independencia financiera','millonari']},
  habitos:{es:'Hábitos y mente', en:'Habits & mindset', k:['hábito','habito','celular','pantalla','disciplina','mente','emocion','pareja','hijos','niños','familia','productiv','2027','metas']}
};
function classify(text){
  const t = (text||'').toLowerCase(); const out=[];
  for(const [id,c] of Object.entries(CATS)) if(c.k.some(k=>t.includes(k))) out.push(id);
  return out.length?out:['habitos'];
}
function cleanDesc(desc){
  return (desc||'').split(/\n+/).map(s=>s.trim()).filter(s=>s.length>25 &&
    !/https?:|www\.|suscr|regístr|registr|clic|click|instagram|tiktok|facebook|whatsapp|link|enlace|patrocin|código|codigo|descuento|#|👉|⬇|👇/i.test(s));
}
function tipFromVideo(v){
  const lines = cleanDesc(v.description);
  return {id:v.id, title:v.title, text:lines.slice(0,2).join(' ').slice(0,260), cats:classify(v.title+' '+v.description), date:v.published};
}

/* ---------------- Utilidades ---------------- */
const $ = s => document.querySelector(s);
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cop = n => '$' + Math.round(n).toLocaleString('es-CO');
function fmtCol(d){ return new Intl.DateTimeFormat(LANG==='es'?'es-CO':'en-US',{timeZone:TZ,day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}).format(new Date(d)); }
function ago(d){
  const m = Math.max(0,(Date.now()-new Date(d))/60000);
  if(m<2) return l('now');
  if(m<60) return LANG==='es'?`hace ${Math.round(m)} min`:`${Math.round(m)} min ago`;
  if(m<1440) return LANG==='es'?`hace ${Math.round(m/60)} h`:`${Math.round(m/60)} h ago`;
  const dd=Math.round(m/1440); return LANG==='es'?`hace ${dd} ${dd===1?'día':'días'}`:`${dd} day${dd===1?'':'s'} ago`;
}
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('on'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('on'),2200); }
const thumb = (id,q='hqdefault') => `https://i.ytimg.com/vi/${id}/${q}.jpg`;

/* ---------------- Datos: robot + búsqueda en vivo ---------------- */
async function loadData(){
  try{
    const r = await fetch('data.json?t='+Date.now(),{cache:'no-store'});
    if(r.ok){ DATA = await r.json(); localStorage.setItem('mpf-data',JSON.stringify(DATA)); }
  }catch(e){
    const s = localStorage.getItem('mpf-data'); if(s){ DATA=JSON.parse(s); toast(l('offline')); }
  }
  renderAll();
}
async function viaProxy(url){
  for(const p of PROXIES){
    try{ const r = await fetch(p(url),{cache:'no-store'}); if(r.ok){ const t=await r.text(); if(t.includes('<')) return t; } }catch(e){}
  }
  return null;
}
function parseYT(xml){
  const doc = new DOMParser().parseFromString(xml,'text/xml');
  return [...doc.getElementsByTagName('entry')].map(e=>{
    const g = n => e.getElementsByTagName(n)[0];
    const stats = g('media:statistics');
    return { id:g('yt:videoId')?.textContent, title:g('title')?.textContent||'', published:g('published')?.textContent,
             description:g('media:description')?.textContent||'', views: stats? +stats.getAttribute('views'):null };
  }).filter(v=>v.id);
}
function parseNews(xml){
  const doc = new DOMParser().parseFromString(xml,'text/xml');
  return [...doc.getElementsByTagName('item')].map(i=>{
    const g = n => i.getElementsByTagName(n)[0]?.textContent||'';
    let title=g('title'); const source=g('source'); if(source && title.endsWith(' - '+source)) title=title.slice(0,-(source.length+3));
    return {title, url:g('link'), date:new Date(g('pubDate')).toISOString(), source};
  }).filter(n=>n.title && n.url);
}
function merge(oldArr,newArr,key){
  const m = new Map(oldArr.map(x=>[x[key],x])); newArr.forEach(x=>m.set(x[key],{...m.get(x[key]),...x}));
  return [...m.values()];
}
async function liveSearch(manual){
  const b=$('#btnRefresh'); b.classList.add('spin'); if(manual) toast(l('refreshing'));
  const [y,n] = await Promise.all([viaProxy(YT_RSS), viaProxy(NEWS_RSS)]);
  let changed=false;
  if(y){ const v=parseYT(y); if(v.length){ DATA.videos=merge(DATA.videos||[],v,'id'); changed=true; } }
  if(n){ const v=parseNews(n); if(v.length){ DATA.news=merge(DATA.news||[],v,'url'); changed=true; } }
  if(changed){ DATA.liveAt=new Date().toISOString(); localStorage.setItem('mpf-data',JSON.stringify(DATA)); renderAll(); }
  b.classList.remove('spin'); if(manual) toast(changed?l('fresh'):l('offline'));
}

/* ---------------- Render ---------------- */
function sortDesc(a,k){ return [...(a||[])].sort((x,y)=>new Date(y[k])-new Date(x[k])); }
function videoCard(v){
  const isNew = Date.now()-new Date(v.published) < 2*86400000;
  const tip = tipFromVideo(v);
  return `<article class="card"><div class="thumb" style="background-image:url('${thumb(v.id)}')" data-play="${esc(v.id)}">
      ${isNew?`<span class="new">${l('newL')}</span>`:''}<span class="dur">${esc(ago(v.published))}</span><span class="play">${l('watch')}</span></div>
    <div class="b"><h3>${esc(v.title)}</h3>
    <div class="meta">${esc(fmtCol(v.published))}${v.views!=null?` · ${Number(v.views).toLocaleString('es-CO')} ${LANG==='es'?'vistas':'views'}`:''}</div>
    ${tip.cats.map(c=>`<span class="tag">${esc(CATS[c][LANG])}</span>`).join('')}</div></article>`;
}
function newsRow(n){
  return `<a class="news" href="${esc(n.url)}" target="_blank" rel="noopener"><div>
    <div class="src">${esc(n.source||l('news'))} · ${esc(ago(n.date))}</div><h3>${esc(n.title)}</h3></div></a>`;
}
function renderAll(){
  const vids = sortDesc(DATA.videos,'published');
  const news = sortDesc(DATA.news,'date');
  const tips = vids.map(tipFromVideo);

  // Héroe con la foto real del último video
  if(vids[0]){
    const img = new Image(); const hi=thumb(vids[0].id,'maxresdefault');
    img.onload=()=>{ $('#heroBg').style.backgroundImage=`url('${img.naturalWidth>200?hi:thumb(vids[0].id)}')`; };
    img.onerror=()=>{ $('#heroBg').style.backgroundImage=`url('${thumb(vids[0].id)}')`; };
    img.src=hi;
  }
  $('#stVideos').textContent = vids.length || '–';
  $('#stTips').textContent = CURATED.length + tips.length;
  const upd = DATA.liveAt || DATA.updated;
  $('#stUpd').textContent = upd ? new Intl.DateTimeFormat('es-CO',{timeZone:TZ,hour:'numeric',minute:'2-digit'}).format(new Date(upd)) : '–';
  $('#ftUpd').textContent = upd ? `${l('updated')} ${fmtCol(upd)} (hora Colombia)` : '';

  // Cinta
  const tick = [...vids.slice(0,6).map(v=>v.title), ...news.slice(0,4).map(n=>n.title)];
  $('#ticker').innerHTML = (tick.length?tick:['Mis Propias Finanzas al Día']).map(t=>`<span>${esc(t)}</span>`).join('');

  // HOY: últimos 7 días, más nuevo primero
  const week = Date.now()-7*86400000;
  const hoy = [
    ...vids.filter(v=>new Date(v.published)>week).map(v=>({t:'v',d:v.published,v})),
    ...news.filter(n=>new Date(n.date)>week).map(n=>({t:'n',d:n.date,n}))
  ].sort((a,b)=>new Date(b.d)-new Date(a.d));
  $('#hoyStamp').textContent = new Intl.DateTimeFormat(LANG==='es'?'es-CO':'en-US',{timeZone:TZ,weekday:'long',day:'numeric',month:'long'}).format(new Date());
  const hv = hoy.filter(x=>x.t==='v').map(x=>videoCard(x.v)).join('');
  const hn = hoy.filter(x=>x.t==='n').slice(0,6).map(x=>newsRow(x.n)).join('');
  $('#hoyList').innerHTML = (hv||hn) ? `${hv?`<div class="grid">${hv}</div>`:''}${hn?`<div style="margin-top:14px">${hn}</div>`:''}`
     : `<div class="empty">${l('none')}</div><div class="grid" style="margin-top:12px">${vids.slice(0,3).map(videoCard).join('')}</div>`;

  // Videos
  $('#vidGrid').innerHTML = vids.map(videoCard).join('') || `<div class="empty">…</div>`;
  $('#vidCount').textContent = vids.length ? `${vids.length}` : '';

  // Noticias
  $('#newsList').innerHTML = news.map(newsRow).join('') || `<div class="empty">…</div>`;
  $('#newsCount').textContent = news.length ? `${news.length}` : '';

  renderCurated(); renderAuto(tips); applyLang(); search();
}
function renderCurated(){
  $('#tipsCurated').innerHTML = CURATED.map(c=>`<div class="tip"><div class="n">${c.n}</div><h4>${esc(c[LANG][0])}</h4><p>${esc(c[LANG][1])}</p>
    <a href="${esc(c.url)}" target="_blank" rel="noopener">${l('source')}: ${esc(c.src)}</a></div>`).join('');
}
function renderAuto(tips){
  tips = tips || sortDesc(DATA.videos,'published').map(tipFromVideo);
  const counts = {}; tips.forEach(t=>t.cats.forEach(c=>counts[c]=(counts[c]||0)+1));
  $('#chips').innerHTML = `<button data-c="todos" class="${CAT==='todos'?'on':''}">${l('all')} (${tips.length})</button>` +
    Object.keys(CATS).filter(c=>counts[c]).map(c=>`<button data-c="${c}" class="${CAT===c?'on':''}">${esc(CATS[c][LANG])} (${counts[c]})</button>`).join('');
  const list = tips.filter(t=>CAT==='todos'||t.cats.includes(CAT));
  $('#tipsAuto').innerHTML = list.map(t=>`<div class="tip" style="border-top-color:var(--lima)">
     <div class="thumb" style="border-radius:10px;margin-bottom:10px;background-image:url('${thumb(t.id)}')" data-play="${esc(t.id)}"><span class="play">${l('watch')}</span></div>
     <div class="n">${esc(t.cats.map(c=>CATS[c][LANG]).join(' · '))}</div><h4>${esc(t.title)}</h4>
     ${t.text?`<p>${esc(t.text)}</p>`:''}<p class="meta">${l('fromVideo')} · ${esc(fmtCol(t.date))}${LANG==='en'?' · '+l('es'):''}</p></div>`).join('')
     || `<div class="empty">…</div>`;
}

/* ---------------- Búsqueda en vivo ---------------- */
function search(){
  const q = ($('#q').value||'').trim().toLowerCase(); const box=$('#searchRes');
  if(q.length<2){ box.innerHTML=''; return; }
  const v = sortDesc(DATA.videos,'published').filter(x=>(x.title+' '+x.description).toLowerCase().includes(q));
  const n = sortDesc(DATA.news,'date').filter(x=>(x.title+' '+x.source).toLowerCase().includes(q));
  const c = CURATED.filter(x=>(x[LANG].join(' ')).toLowerCase().includes(q));
  box.innerHTML = (v.length||n.length||c.length)
    ? `${c.length?`<div class="tips" style="margin:12px 0">${c.map(x=>`<div class="tip"><div class="n">${x.n}</div><h4>${esc(x[LANG][0])}</h4><p>${esc(x[LANG][1])}</p></div>`).join('')}</div>`:''}
       ${v.length?`<div class="grid" style="margin:12px 0">${v.slice(0,9).map(videoCard).join('')}</div>`:''}${n.slice(0,8).map(newsRow).join('')}`
    : `<div class="empty" style="margin-top:10px">${l('noRes')}</div>`;
}

/* ---------------- Herramientas ---------------- */
function calcInteres(){
  const P=+$('#ci0').value||0, M=+$('#ciM').value||0, r=(+$('#ciR').value||0)/100, Y=Math.min(50,Math.max(1,+$('#ciY').value||1));
  const i=Math.pow(1+r,1/12)-1; let bal=P, put=P; const rows=[];
  for(let m=1;m<=Y*12;m++){ bal=bal*(1+i)+M; put+=M; if(m%12===0) rows.push({bal,put}); }
  const max=Math.max(...rows.map(x=>x.bal),1);
  $('#ciRes').innerHTML = `<div>${LANG==='es'?`En ${Y} años podrías tener`:`In ${Y} years you could have`}</div><div class="big">${cop(bal)}</div>
   <div style="font-size:13px;opacity:.9">${LANG==='es'?'Pusiste':'You put in'} ${cop(put)} · ${LANG==='es'?'Ganancia estimada':'Estimated gain'} ${cop(bal-put)}</div>
   <div class="bars">${rows.map(x=>`<div style="height:${x.bal/max*100}%;background:linear-gradient(to top,rgba(255,255,255,.35) ${x.put/x.bal*100}%,var(--menta) ${x.put/x.bal*100}%)"></div>`).join('')}</div>
   <div class="legend"><span><i style="background:rgba(255,255,255,.35)"></i>${LANG==='es'?'Lo que pusiste':'Your money'}</span><span><i style="background:var(--menta)"></i>${LANG==='es'?'Lo que ganó':'Growth'}</span></div>`;
}
function calcPagate(){
  const I=+$('#pgI').value||0, p=+$('#pgP').value, G=+$('#pgG').value||0;
  const mio=I*p/100, libre=I-mio-G;
  const meses6 = G>0? (G*6)/Math.max(mio,1):0;
  $('#pgRes').innerHTML = `<div>${LANG==='es'?`Apenas te paguen, separa el ${p} %`:`As soon as you get paid, set aside ${p}%`}</div><div class="big">${cop(mio)}</div>
   <div style="font-size:14px;margin-top:6px">${LANG==='es'?'Te quedan para gastos variables':'Left for variable spending'}: <b>${cop(libre)}</b>${libre<0?` — <b style="color:#ffb4ab">${LANG==='es'?'revisa tu presupuesto':'review your budget'}</b>`:''}</div>
   <div style="font-size:13px;opacity:.85;margin-top:8px">${LANG==='es'?`Al año separas ${cop(mio*12)}. Con ese ritmo, un fondo de emergencia de 6 meses de gastos fijos (${cop(G*6)}) lo completas en unos ${Math.ceil(meses6)} meses.`
     :`Per year you set aside ${cop(mio*12)}. At this pace, a 6-month emergency fund of fixed expenses (${cop(G*6)}) takes about ${Math.ceil(meses6)} months.`}</div>`;
}
function calcColchon(){
  const M=+$('#clM').value||0, inf=(+$('#clI').value||0)/100, Y=Math.max(1,+$('#clY').value||1);
  const real=M/Math.pow(1+inf,Y), lost=M-real;
  const rows=[...Array(Y+1)].map((_,y)=>M/Math.pow(1+inf,y));
  $('#clRes').innerHTML = `<div>${LANG==='es'?`En ${Y} años, tus ${cop(M)} bajo el colchón comprarán lo que hoy compras con`:`In ${Y} years, your ${cop(M)} under the mattress will buy what today costs`}</div>
   <div class="big">${cop(real)}</div><div style="font-size:13px">${LANG==='es'?'Pierdes en poder de compra':'Purchasing power lost'}: <b style="color:#ffb4ab">${cop(lost)}</b></div>
   <div class="bars">${rows.map(v=>`<div style="height:${v/M*100}%;background:${v===M?'var(--lima)':'var(--menta)'}"></div>`).join('')}</div>`;
}
const QUIZ = [
  {es:'¿Cuándo vas a necesitar esta plata?', en:'When will you need this money?', o:[['Antes de 1 año','Within 1 year',0],['Entre 1 y 3 años','1 to 3 years',1],['Entre 3 y 7 años','3 to 7 years',2],['En más de 7 años','In 7+ years',3]]},
  {es:'Si en un mes la inversión baja 15 %, ¿qué haces?', en:'If the investment drops 15% in a month, what do you do?', o:[['Saco todo','Pull everything out',0],['Saco una parte','Pull some out',1],['No hago nada','Do nothing',2],['Aprovecho y meto más','Add more',3]]},
  {es:'¿Ya tienes fondo de emergencia?', en:'Do you have an emergency fund?', o:[['No','No',0],['Menos de 3 meses de gastos','Less than 3 months',1],['De 3 a 6 meses','3–6 months',2],['Más de 6 meses','More than 6 months',3]]},
  {es:'¿Qué tanto entiendes de inversiones?', en:'How well do you understand investing?', o:[['Nada','Nothing',0],['Lo básico (CDT, cuentas)','Basics (CDs, accounts)',1],['Fondos y ETF','Funds and ETFs',2],['Acciones y mercados','Stocks and markets',3]]}
];
function renderQuiz(){
  $('#quiz').innerHTML = QUIZ.map((q,i)=>`<div class="q"><p>${i+1}. ${esc(q[LANG])}</p>${q.o.map(o=>`<label><input type="radio" name="q${i}" value="${o[2]}">${esc(LANG==='es'?o[0]:o[1])}</label>`).join('')}</div>`).join('');
}
function quizResult(){
  const ans = QUIZ.map((_,i)=>document.querySelector(`input[name=q${i}]:checked`));
  if(ans.some(a=>!a)){ toast(LANG==='es'?'Responde las 4 preguntas':'Answer all 4 questions'); return; }
  const v = ans.map(a=>+a.value); const horizon=v[0]; let s=v.reduce((a,b)=>a+b,0);
  if(horizon===0) s=Math.min(s,3); // el plazo manda
  const P = s<=4? {es:['Conservador','Para esta meta lo tuyo es proteger la plata: CDT, cuentas remuneradas, fondos de liquidez y renta fija de corto plazo.'],en:['Conservative','For this goal, protect the money: CDs, high-yield accounts, money-market funds and short-term fixed income.'],c:'ok'}
          : s<=8? {es:['Moderado','Puedes combinar renta fija con algo de renta variable, por ejemplo fondos diversificados o ETF amplios, sin poner todo en un solo lugar.'],en:['Moderate','You can mix fixed income with some equities, e.g. diversified funds or broad ETFs, without putting everything in one place.'],c:'warn'}
          : {es:['Arriesgado','Tienes tiempo para aguantar caídas: acciones y ETF de largo plazo pueden tener más peso. Solo con plata que no vas a necesitar pronto.'],en:['Aggressive','You have time to ride out drops: long-term stocks and ETFs can weigh more. Only with money you won’t need soon.'],c:'bad'};
  if(v[2]===0) P.extra = LANG==='es'?'Antes de invertir: arma primero tu fondo de emergencia.':'Before investing: build your emergency fund first.';
  $('#quizRes').innerHTML = `<div class="res"><div>${LANG==='es'?'Para esta meta tu perfil es':'For this goal your profile is'}</div><div class="big">${P[LANG][0]}</div><p style="margin-top:6px">${P[LANG][1]}</p>${P.extra?`<p style="margin-top:8px;color:var(--lima);font-weight:700">${P.extra}</p>`:''}</div>`;
}
const SCAM = [
  ['Te garantizan una ganancia fija muy alta (más de 2 % al mes)','They guarantee a very high fixed return (over 2% a month)',3],
  ['Dicen que no hay ningún riesgo','They say there is no risk at all',3],
  ['Te ganas más si traes a otras personas','You earn more by bringing in other people',3],
  ['Te presionan: "solo hoy", "últimos cupos"','They pressure you: "today only", "last spots"',2],
  ['No aparece vigilada por la Superfinanciera','It is not supervised by the Superfinanciera',3],
  ['No te explican claramente en qué invierten tu plata','They don’t clearly explain what your money is invested in',2],
  ['Te piden consignar a una cuenta de una persona','They ask you to deposit into a personal account',2]
];
function renderScam(){
  $('#scam').innerHTML = SCAM.map((s,i)=>`<label><input type="checkbox" data-w="${s[2]}"><span>${esc(LANG==='es'?s[0]:s[1])}</span></label>`).join('');
  scamCheck();
}
function scamCheck(){
  const w=[...document.querySelectorAll('#scam input:checked')].reduce((a,b)=>a+ +b.dataset.w,0);
  const [cls,es,en] = w===0? ['ok','Nada marcado. Igual verifica la entidad antes de consignar.','Nothing ticked. Still verify the entity before depositing.']
    : w<4? ['warn','Hay señales de alerta. Pide documentos y verifica en la Superfinanciera.','Warning signs. Ask for documents and check with the Superfinanciera.']
    : ['bad','Muchas señales de estafa. No metas tu plata ahí.','Many scam signs. Don’t put your money there.'];
  $('#scamRes').innerHTML = `<div class="alert ${cls}">${LANG==='es'?es:en}</div>`;
}


/* ---------------- Guía del buen uso de las tarjetas ---------------- */
const CARD_GUIDE = [
 {id:'debito', es:'Tarjeta débito', en:'Debit card', items:[
  ['Es tu propia plata','Cada compra sale de tu cuenta al instante. Úsala para el gasto del día a día que ya está en tu presupuesto.','It’s your own money','Every purchase comes straight out of your account. Use it for day-to-day spending that is already in your budget.'],
  ['Conoce las cuotas de manejo y retiros','Revisa cuánto te cobran por manejo, por retirar en cajeros de otros bancos y por transferencias. Busca cuentas sin cuota de manejo.','Know the fees','Check what you pay in monthly fees, out-of-network ATM withdrawals and transfers. Look for no-fee accounts.'],
  ['Separa la cuenta de gastos de la de ahorro','Si el ahorro está en la misma cuenta de la tarjeta, se gasta sin darte cuenta. Págate primero y mueve esa parte a otra cuenta.','Keep spending and savings apart','If savings sit in the card’s account, they get spent without noticing. Pay yourself first and move that share elsewhere.'],
  ['Retira en cajeros seguros','Prefiere cajeros dentro de centros comerciales o bancos, de día, tapa el teclado y no aceptes ayuda de desconocidos.','Use safe ATMs','Prefer ATMs inside malls or banks, during the day; cover the keypad and refuse help from strangers.']
 ]},
 {id:'credito', es:'Tarjeta de crédito', en:'Credit card', items:[
  ['Es un préstamo, no un sueldo extra','El cupo es plata prestada del banco. Gasta con ella solo lo que ya tienes para pagar ese mes.','It’s a loan, not extra salary','Your limit is the bank’s money. Only spend what you already have to pay off that month.'],
  ['Compra a una sola cuota','A una cuota normalmente no pagas intereses. Diferir a 12, 24 o 36 cuotas hace que algo pequeño salga mucho más caro (mira la calculadora abajo).','Buy in a single installment','In one installment you usually pay no interest. Spreading it over 12, 24 or 36 makes small things far more expensive (see the calculator below).'],
  ['Paga el total, a tiempo','Paga el valor total del extracto antes de la fecha límite. Pagar solo el mínimo alarga la deuda y casi todo se va en intereses. Programa un recordatorio o el débito automático.','Pay in full, on time','Pay the full statement balance before the due date. Paying only the minimum drags the debt out and most of it goes to interest. Set a reminder or automatic payment.'],
  ['Usa poco del cupo','Que el cupo sea alto no es para usarlo todo. Mantén lo usado bajo y no pidas aumentos de cupo que no necesitas.','Use little of your limit','A high limit is not there to max out. Keep usage low and don’t ask for limit increases you don’t need.'],
  ['No saques plata en efectivo con la crédito','Los avances cobran intereses desde el primer día y suelen tener comisión. Es de las formas más caras de conseguir plata.','No cash advances','Cash advances charge interest from day one and usually a fee. One of the most expensive ways to get money.'],
  ['Una tarjeta no paga a otra','Pagar una tarjeta con otra o con un avance solo pasa la deuda de un lado a otro y la hace crecer. Si ya estás enredado, habla con el banco para reestructurar.','One card doesn’t pay another','Paying one card with another or with an advance just moves the debt and grows it. If you’re stuck, talk to the bank about restructuring.'],
  ['Revisa el extracto cada mes','Mira compra por compra, cobros que no reconoces, seguros que no pediste y la tasa que te están cobrando.','Read your statement monthly','Check every purchase, charges you don’t recognize, insurance you didn’t ask for and the rate you’re being charged.'],
  ['Aprovecha lo bueno','Bien usada te da historial crediticio, protección si te la roban, compras por internet, reservas de hotel y puntos o millas. Solo vale la pena si la pagas completa.','Use the perks','Used well it builds credit history, protects you if stolen, and helps with online purchases, hotel bookings and points or miles. Only worth it if you pay in full.']
 ]},
 {id:'seguridad', es:'Seguridad', en:'Security', items:[
  ['Activa las alertas','Activa en la app del banco las notificaciones de cada compra y retiro. Así detectas un fraude el mismo día.','Turn on alerts','Turn on notifications for every purchase and withdrawal in your bank app, so you catch fraud the same day.'],
  ['Nunca des la clave ni los códigos','El banco jamás te pide por llamada, WhatsApp o correo tu clave, el código que te llega al celular ni los números de atrás de la tarjeta.','Never share your PIN or codes','Your bank will never ask by call, WhatsApp or email for your PIN, the code sent to your phone or the numbers on the back.'],
  ['No pierdas de vista la tarjeta','Al pagar, que pasen la tarjeta delante de ti. Prefiere pagar sin contacto o con el celular.','Keep your card in sight','When paying, have it processed in front of you. Prefer contactless or phone payments.'],
  ['Compra en internet con cuidado','Solo en páginas que conoces, que empiecen con https, y nunca desde un enlace que te llegó por mensaje. Si puedes, usa una tarjeta virtual.','Shop online carefully','Only on sites you know that start with https, never from a link sent by message. Use a virtual card if you can.'],
  ['Si te la roban, bloquéala ya','Bloquéala desde la app o llama al banco de inmediato y reporta las compras que no hiciste.','If stolen, block it now','Block it from the app or call the bank immediately and report purchases you didn’t make.']
 ]},
 {id:'regla', es:'Regla de oro', en:'Golden rule', items:[
  ['Débito para el día a día, crédito solo si la pagas completa','Si no estás seguro de poder pagar el total el próximo mes, usa la débito. La crédito es una herramienta, no una extensión del sueldo.','Debit day to day, credit only if you pay in full','If you’re not sure you can pay the full balance next month, use debit. Credit is a tool, not an extension of your salary.'],
  ['Antes de deslizar, pregúntate','¿Esto está en mi presupuesto? ¿Lo puedo pagar completo este mes? ¿Lo compraría igual si tuviera que pagar en efectivo?','Before you swipe, ask','Is this in my budget? Can I pay it in full this month? Would I still buy it if I had to pay cash?']
 ]}
];
let CARD_TAB='credito';
function renderCards(){
  $('#cardTabs').innerHTML = CARD_GUIDE.map(g=>`<button data-card="${g.id}" class="${CARD_TAB===g.id?'on':''}">${esc(g[LANG])}</button>`).join('');
  const g = CARD_GUIDE.find(x=>x.id===CARD_TAB);
  $('#cardGuide').innerHTML = `<div class="tips">${g.items.map((it,i)=>`<div class="tip" style="border-top-color:${g.id==='seguridad'?'var(--rojo)':g.id==='regla'?'var(--oro)':'var(--menta)'}">
     <div class="n">${String(i+1).padStart(2,'0')}</div><h4>${esc(LANG==='es'?it[0]:it[2])}</h4><p>${esc(LANG==='es'?it[1]:it[3])}</p></div>`).join('')}</div>`;
}
function calcTarjeta(){
  const V=+$('#tcV').value||0, N=Math.max(1,Math.min(72,+$('#tcN').value||1)), EA=(+$('#tcR').value||0)/100;
  const i=Math.pow(1+EA,1/12)-1;
  const cuota = N===1||i===0 ? V/N : V*i/(1-Math.pow(1+i,-N));
  const total=cuota*N, inter=total-V;
  $('#tcRes').innerHTML = `<div>${LANG==='es'?`A ${N} ${N===1?'cuota':'cuotas'} pagarías cada mes`:`In ${N} installment${N===1?'':'s'} you’d pay monthly`}</div><div class="big">${cop(cuota)}</div>
   <div style="font-size:14px;margin-top:6px">${LANG==='es'?'Total pagado':'Total paid'}: <b>${cop(total)}</b> · ${LANG==='es'?'Intereses':'Interest'}: <b style="color:${inter>0?'#ffb4ab':'var(--lima)'}">${cop(inter)}</b></div>
   <div style="font-size:13px;opacity:.85;margin-top:8px">${N===1?(LANG==='es'?'A una cuota normalmente no pagas intereses si cancelas antes de la fecha límite.':'In one installment you usually pay no interest if you pay before the due date.')
     :(LANG==='es'?`Los intereses equivalen al ${Math.round(inter/V*100)} % de lo que compraste. A una sola cuota te ahorrarías ${cop(inter)}.`:`Interest equals ${Math.round(inter/V*100)}% of what you bought. Paying in one installment would save ${cop(inter)}.`)}</div>
   <div class="meta" style="color:#cfe;margin-top:6px">${LANG==='es'?'Cálculo aproximado con cuota fija; tu banco puede sumar seguros o cuota de manejo.':'Approximate fixed-payment estimate; your bank may add insurance or fees.'}</div>`;
}

/* ---------------- Cuenta regresiva del evento ---------------- */
function countdown(){
  const ms = EVENT_AT - Date.now(); const box=$('#count');
  if(ms < -3*3600000){ $('#event').style.display='none'; return; }
  if(ms<=0){ box.innerHTML=`<div><b>${l('ev0')}</b></div>`; return; }
  const d=Math.floor(ms/86400000), h=Math.floor(ms%86400000/3600000), m=Math.floor(ms%3600000/60000), s=Math.floor(ms%60000/1000);
  box.innerHTML = [[d,l('days')],[h,l('hours')],[m,l('mins')],[s,l('secs')]].map(([n,t])=>`<div><b>${n}</b><span>${t}</span></div>`).join('');
}

/* ---------------- Idioma ---------------- */
function applyLang(){
  document.documentElement.lang=LANG;
  if(!T.es._init){ document.querySelectorAll('[data-i18n]').forEach(e=>T.es[e.dataset.i18n]=e.textContent); document.querySelectorAll('[data-i18n-ph]').forEach(e=>T.es[e.dataset.i18nPh]=e.placeholder); T.es._init=1; }
  document.querySelectorAll('[data-i18n]').forEach(e=>{ const v=T[LANG][e.dataset.i18n]; if(v) e.textContent=v; });
  document.querySelectorAll('[data-i18n-ph]').forEach(e=>{ const v=T[LANG][e.dataset.i18nPh]; if(v) e.placeholder=v; });
  $('#btnLang').textContent = LANG==='es'?'EN':'ES';
}

/* ---------------- Eventos ---------------- */
document.addEventListener('click',e=>{
  const tab=e.target.closest('#tabs button');
  if(tab){ document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b===tab));
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id==='v-'+tab.dataset.v)); scrollTo({top:document.querySelector('.ticker').offsetTop,behavior:'smooth'}); return; }
  const go=e.target.closest('[data-goto]');
  if(go){ document.querySelector('#tabs button[data-v=tools]').click(); document.querySelector(`#toolsNav button[data-t=${go.dataset.goto}]`).click(); return; }
  const tn=e.target.closest('#toolsNav button');
  if(tn){ document.querySelectorAll('#toolsNav button').forEach(b=>b.classList.toggle('on',b===tn));
    document.querySelectorAll('.tool').forEach(t=>t.classList.toggle('on',t.id==='t-'+tn.dataset.t)); return; }
  const cb=e.target.closest('#cardTabs button'); if(cb){ CARD_TAB=cb.dataset.card; renderCards(); return; }
  const ch=e.target.closest('#chips button'); if(ch){ CAT=ch.dataset.c; renderAuto(); return; }
  const pl=e.target.closest('[data-play]');
  if(pl){ pl.outerHTML=`<iframe class="iframe" src="https://www.youtube-nocookie.com/embed/${pl.dataset.play}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`; }
});
$('#btnRefresh').onclick=()=>liveSearch(true);
$('#btnLang').onclick=()=>{ LANG=LANG==='es'?'en':'es'; localStorage.setItem('mpf-lang',LANG); renderAll(); renderQuiz(); renderScam(); renderCards(); calcTarjeta(); calcInteres(); calcPagate(); calcColchon(); countdown(); };
$('#q').addEventListener('input',search);
['ci0','ciM','ciR','ciY'].forEach(id=>$('#'+id).addEventListener('input',calcInteres));
['pgI','pgP','pgG'].forEach(id=>$('#'+id).addEventListener('input',calcPagate));
['tcV','tcN','tcR'].forEach(id=>$('#'+id).addEventListener('input',calcTarjeta));
['clM','clI','clY'].forEach(id=>$('#'+id).addEventListener('input',calcColchon));
$('#quizBtn').onclick=quizResult;
$('#scam').addEventListener('change',scamCheck);
document.addEventListener('visibilitychange',()=>{ if(!document.hidden) loadData().then(()=>liveSearch(false)); });

/* ---------------- Arranque: datos del robot + búsqueda en vivo al abrir ---------------- */
applyLang(); renderQuiz(); renderScam(); renderCards(); calcTarjeta(); calcInteres(); calcPagate(); calcColchon(); countdown(); setInterval(countdown,1000);
loadData().then(()=>liveSearch(false));
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
