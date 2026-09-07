import { IMAGES, imageSize } from './images.mjs';

export const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const attr = (s = '') => esc(s);

export const money = (n) => `${Number(n).toLocaleString('ru-RU')} ₽`;

export const plural = (n, one, few, many) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return `${n} ${one}`;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return `${n} ${few}`;
  return `${n} ${many}`;
};

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
export const dateRu = (iso) => {
  const d = new Date(iso + 'T00:00:00Z');
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

/** <img> с явными размерами (нет layout shift), lazy + async decoding. */
export function img(key, alt, opts = {}) {
  const [w, h] = imageSize(key);
  const known = !!IMAGES[key];
  const cls = opts.class ? ` class="${attr(opts.class)}"` : '';
  const eager = opts.eager;
  const sizes = opts.sizes ? ` sizes="${attr(opts.sizes)}"` : '';
  return `<img src="/assets/img/${attr(known ? key : 'hero-main')}.svg" alt="${attr(alt)}" width="${w}" height="${h}"${cls}${sizes}`
    + (eager ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"')
    + `>`;
}

export const cls = (...xs) => xs.filter(Boolean).join(' ');

/** Разбивает заголовок на строки для split-reveal анимации. */
export const splitLines = (lines) =>
  lines.map((l) => `<span class="split-line"><span>${l}</span></span>`).join('');

export const jsonld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

/** Заголовок ≤70 символов: суффикс бренда добавляется, только если помещается. */
export const seoTitle = (base, suffix = 'LUMEN VET') =>
  (base.length + suffix.length + 3 <= 70 ? `${base} | ${suffix}` : base);
