// NearFix client. No build step: plain JS so it runs straight from `npm start`.

const I18N = {
  en: { join: 'Join as a worker', headline: 'Find a worker a few streets from your home', locate: 'Use my location',
    service: 'What do you need?', radius: 'Within', maxVisit: 'Max visit charge (₹)', sort: 'Sort by',
    sortDistance: 'Nearest', sortPrice: 'Lowest price', sortRating: 'Best rated',
    sos: 'Pipe burst or power cut? Get someone now', visit: 'Visit charge', free: 'Free', away: 'km away',
    call: 'Call', book: 'Book', whatsapp: 'WhatsApp', verified: 'ID verified', unverified: 'ID pending', busy: 'Busy now',
    low: 'Visit charge is below the local average', high: 'Visit charge is above the local average', typical: 'Visit charge is near the local average',
    found: (n) => `${n} worker${n === 1 ? '' : 's'} near you`, none: 'No workers match. Try a wider distance or a higher price limit.',
    needLoc: 'Share your location to see workers near you.', locating: 'Finding your location…', located: 'Location set.',
    locFail: 'Could not get your location. Allow location access, or the demo area is used.', yourName: 'Your name',
    yourPhone: 'Mobile number', problem: 'What is the problem?', send: 'Send request', close: 'Close',
    sent: 'Request sent. The worker will call you.', jobs: 'jobs', years: 'yrs' },
  ta: { join: 'தொழிலாளராக சேருங்கள்', headline: 'உங்கள் வீட்டருகே உள்ள தொழிலாளரைக் கண்டறியுங்கள்', locate: 'என் இருப்பிடத்தைப் பயன்படுத்து',
    service: 'உங்களுக்கு என்ன வேண்டும்?', radius: 'தூரம்', maxVisit: 'அதிகபட்ச வருகைக் கட்டணம் (₹)', sort: 'வரிசை',
    sortDistance: 'அருகில்', sortPrice: 'குறைந்த விலை', sortRating: 'சிறந்த மதிப்பீடு',
    sos: 'குழாய் உடைந்ததா அல்லது மின்தடையா? உடனே ஆள் வேண்டும்', visit: 'வருகைக் கட்டணம்', free: 'இலவசம்', away: 'கி.மீ தொலைவில்',
    call: 'அழை', book: 'பதிவு செய்', whatsapp: 'வாட்ஸ்அப்', verified: 'அடையாளம் சரிபார்க்கப்பட்டது', unverified: 'சரிபார்ப்பு நிலுவை', busy: 'இப்போது பிசி',
    low: 'வருகைக் கட்டணம் உள்ளூர் சராசரியை விடக் குறைவு', high: 'வருகைக் கட்டணம் உள்ளூர் சராசரியை விட அதிகம்', typical: 'வருகைக் கட்டணம் உள்ளூர் சராசரிக்கு அருகில்',
    found: (n) => `உங்கள் அருகே ${n} தொழிலாளர்கள்`, none: 'பொருத்தமானவர் இல்லை. தூரம் அல்லது விலை வரம்பை அதிகரிக்கவும்.',
    needLoc: 'அருகிலுள்ளவர்களைக் காண உங்கள் இருப்பிடத்தைப் பகிருங்கள்.', locating: 'இருப்பிடத்தைத் தேடுகிறது…', located: 'இருப்பிடம் அமைக்கப்பட்டது.',
    locFail: 'இருப்பிடம் கிடைக்கவில்லை. அனுமதி வழங்கவும்; டெமோ பகுதி பயன்படுத்தப்படும்.', yourName: 'உங்கள் பெயர்',
    yourPhone: 'மொபைல் எண்', problem: 'என்ன பிரச்சனை?', send: 'கோரிக்கை அனுப்பு', close: 'மூடு',
    sent: 'கோரிக்கை அனுப்பப்பட்டது. தொழிலாளர் உங்களை அழைப்பார்.', jobs: 'வேலைகள்', years: 'ஆண்டுகள்' },
  hi: { join: 'कारीगर के रूप में जुड़ें', headline: 'अपने घर के पास कारीगर खोजें', locate: 'मेरी लोकेशन इस्तेमाल करें',
    service: 'आपको क्या चाहिए?', radius: 'दूरी', maxVisit: 'अधिकतम विज़िट शुल्क (₹)', sort: 'क्रम',
    sortDistance: 'सबसे पास', sortPrice: 'सबसे कम दाम', sortRating: 'सबसे अच्छी रेटिंग',
    sos: 'पाइप फटा या बिजली गई? अभी किसी को बुलाएँ', visit: 'विज़िट शुल्क', free: 'मुफ़्त', away: 'किमी दूर',
    call: 'कॉल', book: 'बुक करें', whatsapp: 'व्हाट्सऐप', verified: 'आईडी सत्यापित', unverified: 'आईडी लंबित', busy: 'अभी व्यस्त',
    low: 'विज़िट शुल्क स्थानीय औसत से कम है', high: 'विज़िट शुल्क स्थानीय औसत से ज़्यादा है', typical: 'विज़िट शुल्क स्थानीय औसत के पास है',
    found: (n) => `आपके पास ${n} कारीगर`, none: 'कोई नहीं मिला। दूरी या दाम की सीमा बढ़ाएँ।',
    needLoc: 'पास के कारीगर देखने के लिए अपनी लोकेशन साझा करें।', locating: 'लोकेशन खोज रहे हैं…', located: 'लोकेशन सेट हो गई।',
    locFail: 'लोकेशन नहीं मिली। अनुमति दें, वरना डेमो क्षेत्र इस्तेमाल होगा।', yourName: 'आपका नाम',
    yourPhone: 'मोबाइल नंबर', problem: 'समस्या क्या है?', send: 'अनुरोध भेजें', close: 'बंद करें',
    sent: 'अनुरोध भेज दिया गया। कारीगर आपको कॉल करेगा।', jobs: 'काम', years: 'साल' }
};

// Used only if the browser denies location, so the demo still works.
const DEMO_ORIGIN = { lat: 12.9716, lng: 77.5946 };

const state = { lang: localStorage.getItem('lang') || 'en', origin: null, service: 'plumber', services: [], workers: [], booking: null };
const $ = (id) => document.getElementById(id);
const t = (k, ...a) => { const v = I18N[state.lang][k] ?? I18N.en[k]; return typeof v === 'function' ? v(...a) : v; };

function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat()) el.append(kid instanceof Node ? kid : document.createTextNode(kid));
  return el;
}

function applyLang() {
  document.documentElement.lang = state.lang;
  $('lang').value = state.lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  renderChips();
  render();
}

function renderChips() {
  $('chips').replaceChildren(...state.services.map((s) =>
    h('button', { class: 'chip', type: 'button', 'aria-pressed': String(s.id === state.service),
      onclick: () => { state.service = s.id; renderChips(); load(); } }, s[state.lang] || s.en)));
}

const rupees = (n) => (n === 0 ? t('free') : '₹' + n.toLocaleString('en-IN'));
const ledgerRow = (label, price, cls = '') =>
  h('li', { class: cls }, h('span', {}, label), h('span', { class: 'dots', 'aria-hidden': 'true' }), h('span', { class: 'price' }, price));

function workerRow(w) {
  const name = h('h3', {}, w.name,
    w.verified ? h('span', { class: 'tag' }, t('verified')) : h('span', { class: 'tag warn' }, t('unverified')),
    w.available ? '' : h('span', { class: 'tag busy' }, t('busy')));
  const meta = h('p', { class: 'meta' },
    `${w.distanceKm} ${t('away')}` + (w.rating ? ` · ★ ${w.rating}` : '') + ` · ${w.jobs} ${t('jobs')} · ${w.years} ${t('years')}`);
  const msg = encodeURIComponent(`Hi ${w.name}, I found you on NearFix.`);
  const actions = h('div', { class: 'actions' },
    h('a', { class: 'btn', href: `tel:+91${w.phone}` }, t('call')),
    h('a', { class: 'btn alt', href: `https://wa.me/91${w.phone}?text=${msg}`, target: '_blank', rel: 'noopener' }, t('whatsapp')),
    h('button', { class: 'btn go', type: 'button', onclick: () => openBooking(w) }, t('book')));
  const ledger = h('ul', { class: 'ledger', 'aria-label': t('visit') },
    ledgerRow(t('visit'), rupees(w.visitCharge), 'visit'),
    w.rates.map((r) => ledgerRow(r.task, rupees(r.price))),
    h('span', { class: `band ${w.priceBand}` }, t(w.priceBand)));
  return h('article', { class: 'worker' }, h('div', {}, name, meta, actions), ledger);
}

function render() {
  const list = $('list');
  if (!state.origin) { $('count').textContent = ''; list.replaceChildren(h('p', { class: 'empty' }, t('needLoc'))); return; }
  $('count').textContent = t('found', state.workers.length);
  list.replaceChildren(...(state.workers.length ? state.workers.map(workerRow) : [h('p', { class: 'empty' }, t('none'))]));
}

async function load() {
  if (!state.origin) return render();
  const p = new URLSearchParams({ lat: state.origin.lat, lng: state.origin.lng, service: state.service,
    radius: $('radius').value, sort: $('sort').value });
  if ($('maxVisit').value) p.set('maxVisit', $('maxVisit').value);
  const res = await fetch('/api/workers?' + p);
  state.workers = res.ok ? await res.json() : [];
  render();
}

function locate() {
  const status = $('locStatus');
  status.className = 'status'; status.textContent = t('locating');
  const done = (o, msg, err) => { state.origin = o; status.textContent = msg; status.className = 'status' + (err ? ' err' : ''); load(); };
  if (!navigator.geolocation) return done(DEMO_ORIGIN, t('locFail'), true);
  navigator.geolocation.getCurrentPosition(
    (pos) => done({ lat: pos.coords.latitude, lng: pos.coords.longitude }, t('located')),
    () => done(DEMO_ORIGIN, t('locFail'), true),
    { enableHighAccuracy: true, timeout: 10000 });
}

async function sos() {
  const out = $('sosStatus');
  if (!state.origin) { out.className = 'status err'; out.textContent = t('needLoc'); return; }
  $('sos').disabled = true;
  try {
    const res = await fetch('/api/emergency', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ service: state.service, ...state.origin }) });
    const data = await res.json();
    out.className = 'status'; out.textContent = data.message || data.error;
  } finally { $('sos').disabled = false; }
}

function openBooking(w) {
  state.booking = w;
  $('bookTitle').textContent = `${t('book')}: ${w.name}`;
  $('bookStatus').textContent = '';
  $('book').showModal();
}

$('bookForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const res = await fetch('/api/bookings', { method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ workerId: state.booking.id, ...f }) });
  const data = await res.json();
  $('bookStatus').className = 'status' + (res.ok ? '' : ' err');
  $('bookStatus').textContent = res.ok ? t('sent') : data.error;
});
$('bookCancel').addEventListener('click', () => $('book').close());
$('locate').addEventListener('click', locate);
$('sos').addEventListener('click', sos);
$('lang').addEventListener('change', (e) => { state.lang = e.target.value; localStorage.setItem('lang', state.lang); applyLang(); });
$('radius').addEventListener('input', () => { $('radiusOut').textContent = $('radius').value; load(); });
$('maxVisit').addEventListener('change', load);
$('sort').addEventListener('change', load);

(async () => {
  state.services = await (await fetch('/api/services')).json();
  applyLang();
})();
