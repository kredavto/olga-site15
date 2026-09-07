/* Генератор изображений.
   Все визуалы — самодостаточные SVG: мягкие градиентные композиции с
   размытым силуэтом, боке и световым свипом. Они рассчитаны как
   премиальные плейсхолдеры: замените файл в assets/img/<key>.svg на
   реальное фото (WebP/AVIF) — разметка <picture>/<img> уже готова. */

const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const rng = (seed) => { let s = seed || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };

const PALETTES = {
  teal:   { a: '#04191B', b: '#0B4F4E', c: '#159A93', d: '#8FE7DA', warm: '#D9C7A6' },
  deep:   { a: '#03181A', b: '#0A3B3D', c: '#0F827E', d: '#6FE0D0', warm: '#C9B392' },
  sage:   { a: '#1C2A22', b: '#3E5847', c: '#6E8874', d: '#CBDACE', warm: '#E4D9C2' },
  sand:   { a: '#2A231A', b: '#6B5A42', c: '#B49B78', d: '#F1EADD', warm: '#FFF6E6' },
  light:  { a: '#9FBAB7', b: '#C9DBD8', c: '#E9F1EF', d: '#FFFFFF', warm: '#F4EADB' },
  clinic: { a: '#0A2B2E', b: '#14595A', c: '#2FB5AB', d: '#CFF3EC', warm: '#E8F3F0' }
};

const SIL = {
  dog: 'M30,126 C34,113 45,104 63,100 C71,83 79,69 97,61 C105,51 117,49 123,58 C129,68 125,85 119,95 C131,111 139,133 147,159 L157,196 L108,196 C104,173 96,158 82,150 C68,144 52,142 42,146 C32,150 26,140 30,126 Z',
  cat: 'M100,196 C73,196 58,180 58,158 C58,141 67,128 78,119 C73,109 71,95 73,83 L81,60 L97,78 C105,75 115,75 123,78 L139,60 L147,83 C149,95 147,109 142,119 C153,128 162,141 162,158 C162,180 147,196 120,196 Z',
  pair: 'M42,196 C40,164 46,141 58,128 C52,116 55,100 67,93 C78,87 92,91 96,102 C101,113 97,124 90,130 C106,137 118,152 123,172 C132,161 148,160 156,169 C164,178 162,192 152,196 Z',
  care: 'M28,196 C28,166 38,144 56,132 C50,120 53,104 66,97 C78,90 93,95 97,107 C101,118 96,129 88,134 C104,140 116,152 122,168 C128,150 142,138 160,136 C176,134 190,142 196,156 L196,196 Z',
  room: 'M0,196 L0,150 L36,150 L36,74 L96,74 L96,150 L124,150 L124,96 L172,96 L172,150 L200,150 L200,196 Z',
  device: 'M46,196 L46,168 L58,168 L58,72 C58,62 66,54 76,54 L142,54 C152,54 160,62 160,72 L160,168 L172,168 L172,196 Z',
  wave: 'M8,140 L44,140 L56,108 L74,168 L88,120 L102,148 L118,96 L134,150 L148,140 L192,140'
};

const RATIOS = { wide: [1600, 1000], hero: [1400, 1230], card: [1200, 750], tall: [900, 1150], portrait: [900, 1035], square: [1000, 1000], pano: [1800, 900], thumb: [400, 400] };

function svg(key, { pal = 'teal', sil = 'dog', ratio = 'card', light = 0.5 } = {}) {
  const p = PALETTES[pal] || PALETTES.teal;
  const [W, H] = RATIOS[ratio] || RATIOS.card;
  const r = rng(hash(key));
  const id = 'i' + (hash(key) % 100000);
  const bokeh = [];
  const n = 7 + Math.floor(r() * 5);
  for (let i = 0; i < n; i++) {
    const cx = r() * W, cy = r() * H, rr = (0.04 + r() * 0.11) * W;
    bokeh.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${rr.toFixed(0)}" fill="url(#${id}bok)" opacity="${(0.10 + r() * 0.24).toFixed(2)}"/>`);
  }
  const silPath = SIL[sil] || SIL.dog;
  const scale = H / 200 * (sil === 'room' || sil === 'device' ? 1 : 1.06);
  const offX = (W - 200 * scale) / 2 + (r() - 0.5) * W * 0.1;
  const offY = H - 200 * scale + (sil === 'room' || sil === 'device' ? 0 : H * 0.03);
  const isLine = sil === 'wave';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="${id}base" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${p.a}"/><stop offset=".55" stop-color="${p.b}"/><stop offset="1" stop-color="${p.a}"/>
</linearGradient>
<radialGradient id="${id}l1" cx="${(18 + r() * 26).toFixed(0)}%" cy="${(12 + r() * 20).toFixed(0)}%" r="72%">
<stop offset="0" stop-color="${p.d}" stop-opacity="${(0.42 * light + 0.16).toFixed(2)}"/><stop offset="1" stop-color="${p.d}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="${id}l2" cx="${(66 + r() * 26).toFixed(0)}%" cy="${(64 + r() * 26).toFixed(0)}%" r="66%">
<stop offset="0" stop-color="${p.c}" stop-opacity=".5"/><stop offset="1" stop-color="${p.c}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="${id}l3" cx="${(80 - r() * 40).toFixed(0)}%" cy="${(84 - r() * 20).toFixed(0)}%" r="60%">
<stop offset="0" stop-color="${p.warm}" stop-opacity=".24"/><stop offset="1" stop-color="${p.warm}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="${id}bok"><stop offset="0" stop-color="${p.d}" stop-opacity=".85"/><stop offset=".72" stop-color="${p.d}" stop-opacity=".18"/><stop offset="1" stop-color="${p.d}" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}vig" cx="50%" cy="46%" r="72%"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="${p.a}" stop-opacity=".72"/></radialGradient>
<linearGradient id="${id}sw" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".13"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${id}sil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.a}" stop-opacity=".46"/><stop offset=".5" stop-color="${p.a}" stop-opacity=".68"/><stop offset="1" stop-color="${p.a}" stop-opacity=".88"/></linearGradient>
<linearGradient id="${id}rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.d}" stop-opacity=".55"/><stop offset=".5" stop-color="${p.d}" stop-opacity=".12"/><stop offset="1" stop-color="${p.d}" stop-opacity="0"/></linearGradient>
<linearGradient id="${id}dof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.a}" stop-opacity="0"/><stop offset="1" stop-color="${p.a}" stop-opacity=".45"/></linearGradient>
<filter id="${id}blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(W / 190).toFixed(1)}"/></filter>
<filter id="${id}soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(W / 300).toFixed(1)}"/></filter>
<filter id="${id}grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#${id}base)"/>
<rect width="${W}" height="${H}" fill="url(#${id}l1)"/>
<rect width="${W}" height="${H}" fill="url(#${id}l2)"/>
<rect width="${W}" height="${H}" fill="url(#${id}l3)"/>
<g filter="url(#${id}blur)">${bokeh.join('')}</g>
<g transform="translate(${offX.toFixed(0)} ${offY.toFixed(0)}) scale(${scale.toFixed(3)})" filter="url(#${id}soft)">
${isLine
      ? `<path d="${silPath}" fill="none" stroke="${p.d}" stroke-opacity=".55" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<path d="${silPath}" fill="url(#${id}sil)"/><path d="${silPath}" fill="none" stroke="url(#${id}rim)" stroke-width="2.2"/>`}
</g>
<rect y="${(H * 0.62).toFixed(0)}" width="${W}" height="${(H * 0.38).toFixed(0)}" fill="url(#${id}dof)"/>
<rect width="${W}" height="${H}" fill="url(#${id}sw)"/>
<rect width="${W}" height="${H}" fill="url(#${id}vig)"/>
<rect width="${W}" height="${H}" filter="url(#${id}grain)" opacity=".055" style="mix-blend-mode:overlay"/>
</svg>`;
}

// Реестр всех изображений сайта: key -> параметры композиции
export const IMAGES = {
  'hero-main':    { pal: 'deep',   sil: 'care',   ratio: 'hero',  light: .75 },
  'finale':       { pal: 'teal',   sil: 'pair',   ratio: 'pano',  light: .7 },
  'about-main':   { pal: 'sage',   sil: 'room',   ratio: 'wide',  light: .6 },
  'about-team':   { pal: 'sand',   sil: 'pair',   ratio: 'card',  light: .65 },

  therapy:        { pal: 'clinic', sil: 'pair',   ratio: 'card' },
  surgery:        { pal: 'deep',   sil: 'device', ratio: 'card' },
  diagnostics:    { pal: 'teal',   sil: 'wave',   ratio: 'card' },
  vaccination:    { pal: 'sage',   sil: 'cat',    ratio: 'card' },
  dentistry:      { pal: 'clinic', sil: 'dog',    ratio: 'card' },
  grooming:       { pal: 'sand',   sil: 'dog',    ratio: 'card' },
  dermatology:    { pal: 'sage',   sil: 'cat',    ratio: 'card' },
  cardiology:     { pal: 'deep',   sil: 'wave',   ratio: 'card' },
  hospital:       { pal: 'teal',   sil: 'room',   ratio: 'card' },

  'doc-orlova':   { pal: 'clinic', sil: 'pair',   ratio: 'portrait' },
  'doc-sergeev':  { pal: 'deep',   sil: 'pair',   ratio: 'portrait' },
  'doc-kim':      { pal: 'teal',   sil: 'pair',   ratio: 'portrait' },
  'doc-valeeva':  { pal: 'sage',   sil: 'pair',   ratio: 'portrait' },
  'doc-nazarov':  { pal: 'deep',   sil: 'pair',   ratio: 'portrait' },
  'doc-leonova':  { pal: 'sand',   sil: 'pair',   ratio: 'portrait' },

  'eq-usg':       { pal: 'teal',   sil: 'device', ratio: 'card' },
  'eq-lab':       { pal: 'clinic', sil: 'device', ratio: 'card' },
  'eq-or':        { pal: 'deep',   sil: 'room',   ratio: 'card' },
  'eq-monitor':   { pal: 'teal',   sil: 'wave',   ratio: 'card' },
  'eq-oxygen':    { pal: 'clinic', sil: 'room',   ratio: 'card' },
  'eq-dental':    { pal: 'sage',   sil: 'device', ratio: 'card' },

  'story-barni':  { pal: 'sand',   sil: 'dog',    ratio: 'card' },
  'story-musya':  { pal: 'sage',   sil: 'cat',    ratio: 'card' },
  'story-tor':    { pal: 'deep',   sil: 'cat',    ratio: 'card' },
  'story-leya':   { pal: 'sand',   sil: 'dog',    ratio: 'card' },
  'story-gosha':  { pal: 'clinic', sil: 'dog',    ratio: 'card' },

  'gal-1':  { pal: 'clinic', sil: 'pair',   ratio: 'tall' },
  'gal-2':  { pal: 'sand',   sil: 'cat',    ratio: 'wide' },
  'gal-3':  { pal: 'teal',   sil: 'device', ratio: 'card' },
  'gal-4':  { pal: 'sage',   sil: 'dog',    ratio: 'card' },
  'gal-5':  { pal: 'sand',   sil: 'room',   ratio: 'wide' },
  'gal-6':  { pal: 'light',  sil: 'cat',    ratio: 'tall' },
  'gal-7':  { pal: 'deep',   sil: 'room',   ratio: 'card' },
  'gal-8':  { pal: 'sage',   sil: 'dog',    ratio: 'card' },
  'gal-9':  { pal: 'clinic', sil: 'room',   ratio: 'wide' },
  'gal-10': { pal: 'teal',   sil: 'device', ratio: 'card' },

  'pet-1': { pal: 'sand',   sil: 'dog', ratio: 'thumb' },
  'pet-2': { pal: 'sage',   sil: 'cat', ratio: 'thumb' },
  'pet-3': { pal: 'deep',   sil: 'cat', ratio: 'thumb' },
  'pet-4': { pal: 'clinic', sil: 'dog', ratio: 'thumb' },
  'pet-5': { pal: 'teal',   sil: 'dog', ratio: 'thumb' },
  'pet-6': { pal: 'sage',   sil: 'dog', ratio: 'thumb' },
  'pet-7': { pal: 'light',  sil: 'cat', ratio: 'thumb' },
  'pet-8': { pal: 'sand',   sil: 'dog', ratio: 'thumb' },
  'pet-9': { pal: 'clinic', sil: 'cat', ratio: 'thumb' },

  'post-1':  { pal: 'deep',   sil: 'dog',    ratio: 'card' },
  'post-2':  { pal: 'sage',   sil: 'dog',    ratio: 'card' },
  'post-3':  { pal: 'clinic', sil: 'cat',    ratio: 'card' },
  'post-4':  { pal: 'sand',   sil: 'cat',    ratio: 'card' },
  'post-5':  { pal: 'sage',   sil: 'cat',    ratio: 'card' },
  'post-6':  { pal: 'light',  sil: 'cat',    ratio: 'card' },
  'post-7':  { pal: 'sand',   sil: 'cat',    ratio: 'card' },
  'post-8':  { pal: 'teal',   sil: 'dog',    ratio: 'card' },
  'post-9':  { pal: 'clinic', sil: 'dog',    ratio: 'card' },
  'post-10': { pal: 'deep',   sil: 'device', ratio: 'card' }
};

export const RATIO_SIZE = RATIOS;
export const renderImage = (key) => svg(key, IMAGES[key] || {});
export const imageSize = (key) => RATIOS[(IMAGES[key] || {}).ratio || 'card'];

/* Логотип: щит + импульс */
export const logoMark = (cls = 'logo__mark') => `<span class="${cls}" aria-hidden="true"><svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#159A93"/><stop offset="1" stop-color="#6FE0D0"/></linearGradient></defs>
<path d="M50 8 79 21v27c0 20-14 31-29 37-15-6-29-17-29-37V21L50 8Z" fill="url(#lg1)" fill-opacity=".16" stroke="url(#lg1)" stroke-width="4" stroke-linejoin="round"/>
<path d="M30 52h11l6-13 8 26 5-13h10" stroke="url(#lg1)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>`;

export const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#159A93"/><stop offset="1" stop-color="#6FE0D0"/></linearGradient></defs>
<rect width="100" height="100" rx="24" fill="#071E21"/>
<path d="M50 16 76 27v24c0 18-12 28-26 33-14-5-26-15-26-33V27L50 16Z" fill="none" stroke="url(#g)" stroke-width="5" stroke-linejoin="round"/>
<path d="M32 52h10l6-12 8 24 5-12h9" fill="none" stroke="url(#g)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export const ogImage = (title, sub) => {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
<defs>
<linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#04191B"/><stop offset=".6" stop-color="#0B3A3C"/><stop offset="1" stop-color="#07272A"/></linearGradient>
<radialGradient id="l" cx="18%" cy="12%" r="70%"><stop offset="0" stop-color="#6FE0D0" stop-opacity=".38"/><stop offset="1" stop-color="#6FE0D0" stop-opacity="0"/></radialGradient>
<radialGradient id="m" cx="88%" cy="86%" r="60%"><stop offset="0" stop-color="#159A93" stop-opacity=".45"/><stop offset="1" stop-color="#159A93" stop-opacity="0"/></radialGradient>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#159A93"/><stop offset="1" stop-color="#6FE0D0"/></linearGradient>
</defs>
<rect width="1200" height="630" fill="url(#b)"/><rect width="1200" height="630" fill="url(#l)"/><rect width="1200" height="630" fill="url(#m)"/>
<g transform="translate(80 74)">
<g transform="scale(.62)"><path d="M50 8 79 21v27c0 20-14 31-29 37-15-6-29-17-29-37V21L50 8Z" fill="none" stroke="url(#g)" stroke-width="4.5" stroke-linejoin="round"/><path d="M30 52h11l6-13 8 26 5-13h10" fill="none" stroke="url(#g)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>
<text x="76" y="40" fill="#fff" font-family="Manrope,Segoe UI,sans-serif" font-size="30" font-weight="800" letter-spacing="4">LUMEN VET</text>
<text x="76" y="66" fill="#7FBEB6" font-family="Manrope,Segoe UI,sans-serif" font-size="15" letter-spacing="3">ВЕТЕРИНАРНАЯ КЛИНИКА · 24/7</text>
</g>
<text x="80" y="330" fill="#FFFFFF" font-family="Manrope,Segoe UI,sans-serif" font-size="58" font-weight="300" letter-spacing="-2">${esc(title).slice(0, 42)}</text>
<text x="80" y="404" fill="#A9C7C4" font-family="Manrope,Segoe UI,sans-serif" font-size="27" font-weight="400">${esc(sub).slice(0, 68)}</text>
<rect x="80" y="486" width="286" height="62" rx="31" fill="url(#g)"/>
<text x="223" y="525" fill="#03181A" font-family="Manrope,Segoe UI,sans-serif" font-size="21" font-weight="700" text-anchor="middle">Записаться на приём</text>
<text x="404" y="525" fill="#CFF3EC" font-family="Manrope,Segoe UI,sans-serif" font-size="21" font-weight="600">+7 (495) 120-24-07</text>
</svg>`;
};
