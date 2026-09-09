#!/usr/bin/env node
/* Статический генератор сайта LUMEN VET. Без зависимостей.
   Запуск: npm run build  →  ./dist */
import { mkdir, writeFile, readFile, rm, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { clinic } from './src/data/clinic.mjs';
import { services } from './src/data/services.mjs';
import { doctors } from './src/data/doctors.mjs';
import { posts } from './src/data/posts.mjs';
import { IMAGES, renderImage, faviconSvg, ogImage } from './src/lib/images.mjs';
import { photos, photoDir } from './src/lib/photos.mjs';

import homePage from './src/pages/home.mjs';
import { servicesIndex, servicePage } from './src/pages/services.mjs';
import { doctorsIndex, doctorPage } from './src/pages/doctors.mjs';
import pricesPage from './src/pages/prices.mjs';
import bookingPage from './src/pages/booking.mjs';
import { blogIndex, postPage } from './src/pages/blog.mjs';
import { aboutPage, contactsPage, reviewsPage, promoPage, faqPage, privacyPage, notFoundPage } from './src/pages/misc.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'dist');

const write = async (rel, content) => {
  const file = join(OUT, rel);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content, 'utf8');
  return Buffer.byteLength(content, 'utf8');
};

/* ---------- Карта маршрутов ---------- */
const routes = [
  { path: '/', render: homePage, prio: '1.0', freq: 'weekly' },
  { path: '/services/', render: servicesIndex, prio: '0.9', freq: 'monthly' },
  ...services.map((s) => ({ path: `/services/${s.slug}/`, render: () => servicePage(s.slug), prio: '0.8', freq: 'monthly' })),
  { path: '/doctors/', render: doctorsIndex, prio: '0.9', freq: 'monthly' },
  ...doctors.map((d) => ({ path: `/doctors/${d.slug}/`, render: () => doctorPage(d.slug), prio: '0.7', freq: 'monthly' })),
  { path: '/prices/', render: pricesPage, prio: '0.9', freq: 'weekly' },
  { path: '/about/', render: aboutPage, prio: '0.7', freq: 'yearly' },
  { path: '/reviews/', render: reviewsPage, prio: '0.7', freq: 'weekly' },
  { path: '/blog/', render: blogIndex, prio: '0.8', freq: 'weekly' },
  ...posts.map((p) => ({ path: `/blog/${p.slug}/`, render: () => postPage(p.slug), prio: '0.6', freq: 'monthly', lastmod: p.date })),
  { path: '/promo/', render: promoPage, prio: '0.7', freq: 'weekly' },
  { path: '/faq/', render: faqPage, prio: '0.7', freq: 'monthly' },
  { path: '/contacts/', render: contactsPage, prio: '0.9', freq: 'monthly' },
  { path: '/booking/', render: bookingPage, prio: '0.9', freq: 'monthly' },
  { path: '/privacy/', render: privacyPage, prio: '0.2', freq: 'yearly' }
];

/* ---------- Минификация CSS (безопасная) ---------- */
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

/* ---------- OG-картинки ---------- */
function ogTargets() {
  const list = [
    ['default', 'Ветеринарная клиника 24/7', 'Экстренная помощь, диагностика и лечение в одной клинике'],
    ['services', 'Услуги клиники', 'Девять направлений: от терапии до стационара'],
    ['doctors', 'Наши врачи', 'Команда специалистов, которым доверяют самое дорогое'],
    ['prices', 'Прозрачные цены', 'Прайс-лист и калькулятор ориентировочной стоимости'],
    ['about', 'О клинике', 'Место, где медицина начинается с заботы'],
    ['reviews', 'Отзывы', 'Средняя оценка 4.9 по отзывам владельцев'],
    ['blog', 'Блог о здоровье питомцев', 'Статьи ветеринарных врачей клиники'],
    ['promo', 'Акции и профилактика', 'Комплексные программы по специальной цене'],
    ['faq', 'Частые вопросы', 'Ответы на то, что спрашивают чаще всего'],
    ['contacts', 'Контакты', 'Пресненская наб., 12 · круглосуточно'],
    ['booking', 'Онлайн-запись', 'Запишитесь на приём за одну минуту']
  ];
  services.forEach((s) => list.push([`service-${s.slug}`, s.title, s.lead.slice(0, 66)]));
  doctors.forEach((d) => list.push([`doctor-${d.slug}`, d.name, d.role]));
  posts.forEach((p) => list.push([`post-${p.slug}`, p.title.slice(0, 42), p.excerpt.slice(0, 66)]));
  return list;
}

/* ---------- Сборка ---------- */
async function build() {
  const t0 = Date.now();
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  // CSS bundle
  const cssDir = join(ROOT, 'src/assets');
  const cssFiles = (await readdir(cssDir)).filter((f) => f.endsWith('.css')).sort();
  const css = (await Promise.all(cssFiles.map((f) => readFile(join(cssDir, f), 'utf8')))).join('\n');
  const cssBytes = await write('assets/styles.css', minifyCss(css));

  // JS
  const js = await readFile(join(cssDir, 'app.js'), 'utf8');
  const jsBytes = await write('assets/app.js', js);

  // Изображения: сгенерированные SVG-плейсхолдеры…
  let imgBytes = 0;
  for (const key of Object.keys(IMAGES)) imgBytes += await write(`assets/img/${key}.svg`, renderImage(key));
  // …и реальные фотографии из src/photos, если они есть
  let photoBytes = 0, photoFiles = 0;
  for (const entry of photos.values()) {
    for (const f of entry.files) {
      const buf = await readFile(join(photoDir, f.name));
      await mkdir(join(OUT, 'assets/img'), { recursive: true });
      await writeFile(join(OUT, 'assets/img', f.name), buf);
      photoBytes += buf.length; photoFiles++;
    }
  }
  await write('assets/favicon.svg', faviconSvg);
  let ogBytes = 0;
  for (const [key, title, sub] of ogTargets()) ogBytes += await write(`assets/og/${key}.svg`, ogImage(title, sub));

  // Страницы
  let htmlBytes = 0, pages = 0;
  for (const r of routes) {
    const file = r.path === '/' ? 'index.html' : `${r.path.replace(/^\/|\/$/g, '')}/index.html`;
    htmlBytes += await write(file, r.render());
    pages++;
  }
  htmlBytes += await write('404.html', notFoundPage());

  // sitemap / robots / manifest
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${clinic.site}${r.path}</loc><lastmod>${r.lastmod || today}</lastmod><changefreq>${r.freq}</changefreq><priority>${r.prio}</priority></url>`).join('\n')}
</urlset>`;
  await write('sitemap.xml', sitemap);
  await write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: ${clinic.site}/sitemap.xml\nHost: ${clinic.site.replace('https://', '')}\n`);
  await write('site.webmanifest', JSON.stringify({
    name: `${clinic.name} — ветеринарная клиника 24/7`,
    short_name: clinic.name,
    description: 'Круглосуточная ветеринарная клиника в Москве',
    start_url: '/', display: 'standalone',
    background_color: '#071E21', theme_color: '#071E21', lang: 'ru',
    icons: [{ src: '/assets/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
  }, null, 2));
  await write('.nojekyll', '');

  const kb = (b) => (b / 1024).toFixed(1) + ' KB';
  console.log(`✓ Сборка за ${Date.now() - t0} мс`);
  console.log(`  HTML   ${pages + 1} страниц  ${kb(htmlBytes)}`);
  console.log(`  CSS    ${kb(cssBytes)}   JS ${kb(jsBytes)}`);
  console.log(`  IMG    ${Object.keys(IMAGES).length} SVG ${kb(imgBytes)}  ·  OG ${ogTargets().length} ${kb(ogBytes)}`);
  console.log(`  ФОТО   ${photos.size} из ${Object.keys(IMAGES).length} ключей заменены реальными снимками (${photoFiles} файлов, ${kb(photoBytes)})`);
  console.log(`  →  ${OUT}`);
}

build().catch((e) => { console.error(e); process.exit(1); });
