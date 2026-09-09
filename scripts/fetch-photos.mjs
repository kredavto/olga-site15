#!/usr/bin/env node
/* Загрузка фотографий с Unsplash во все слоты сайта.
 *
 * Запуск (нужен бесплатный Access Key приложения Unsplash):
 *   UNSPLASH_ACCESS_KEY=xxx node scripts/fetch-photos.mjs
 *
 * Полезные флаги:
 *   --only hero-main,therapy   обработать только эти ключи
 *   --force                    перекачать даже те слоты, где файл уже есть
 *   --pick 2                   взять 2-й результат поиска вместо первого
 *   --list                     ничего не качать, показать план
 *
 * Ручной режим (без API): создайте src/photos/sources.txt со строками
 *   hero-main https://images.unsplash.com/photo-...
 * и запустите:  node scripts/fetch-photos.mjs --from-list
 *
 * Скрипт скачивает файл, проверяет, что это действительно изображение,
 * сохраняет как src/photos/<ключ>.jpg и собирает src/photos/CREDITS.md
 * со списком авторов — этого требует лицензия Unsplash при использовании API.
 */
import { writeFile, readFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { IMAGES, RATIO_SIZE } from '../src/lib/images.mjs';
import { queries } from '../src/photos/queries.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'photos');
const API = 'https://api.unsplash.com';

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const value = (n, d) => { const i = argv.indexOf(n); return i > -1 && argv[i + 1] ? argv[i + 1] : d; };

const ONLY = value('--only', '').split(',').filter(Boolean);
const FORCE = flag('--force');
const LIST = flag('--list');
const FROM_LIST = flag('--from-list');
const PICK = Math.max(1, parseInt(value('--pick', '1'), 10)) - 1;

/** Ориентация запроса к Unsplash по пропорциям слота. */
const orientationFor = (ratio) => {
  if (ratio === 'tall' || ratio === 'portrait') return 'portrait';
  if (ratio === 'thumb' || ratio === 'square' || ratio === 'hero') return 'squarish';
  return 'landscape';
};

const slots = Object.keys(IMAGES)
  .filter((k) => !ONLY.length || ONLY.includes(k))
  .map((k) => {
    const ratio = IMAGES[k].ratio || 'card';
    const [w, h] = RATIO_SIZE[ratio];
    return { key: k, ratio, w, h, orientation: orientationFor(ratio), query: queries[k] };
  });

const unknownKeys = ONLY.filter((k) => !IMAGES[k]);
if (unknownKeys.length) {
  console.error(`Неизвестные ключи в --only: ${unknownKeys.join(', ')}`);
  console.error('Список доступных ключей: node scripts/fetch-photos.mjs --list');
  process.exit(1);
}

const missingQuery = slots.filter((s) => !s.query);
if (missingQuery.length) {
  console.error(`Нет запроса для ключей: ${missingQuery.map((s) => s.key).join(', ')}`);
  console.error('Добавьте их в src/photos/queries.mjs');
  process.exit(1);
}

const existing = new Set(
  (existsSync(OUT) ? await readdir(OUT) : [])
    .map((f) => (/^(.+)\.(avif|webp|jpe?g|png)$/i.exec(f) || [])[1])
    .filter(Boolean)
);

if (LIST) {
  console.log(`Слотов: ${slots.length}\n`);
  for (const s of slots) {
    const mark = existing.has(s.key) ? 'есть' : '—   ';
    console.log(`${mark}  ${s.key.padEnd(14)} ${String(s.w).padStart(4)}×${String(s.h).padEnd(4)} ${s.orientation.padEnd(9)} ${s.query}`);
  }
  process.exit(0);
}

const credits = [];
let ok = 0, skipped = 0, failed = 0;

/** Проверяет, что скачанное — действительно изображение, а не HTML-ошибка. */
function sniff(buf) {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8) return 'jpg';
  if (buf.length > 8 && buf.readUInt32BE(0) === 0x89504e47) return 'png';
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return null;
}

async function download(url, key) {
  let res;
  try { res = await fetch(url); }
  catch (e) { throw new Error(`не удалось скачать файл (${e.message})`); }
  if (!res.ok) throw new Error(`HTTP ${res.status} при загрузке файла`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = sniff(buf);
  if (!ext) throw new Error(`ответ не является изображением (${buf.length} байт)`);
  await mkdir(OUT, { recursive: true });
  await writeFile(join(OUT, `${key}.${ext}`), buf);
  return { ext, bytes: buf.length };
}

/* ---------- Режим 1: ручной список ссылок ---------- */
if (FROM_LIST) {
  const file = join(OUT, 'sources.txt');
  if (!existsSync(file)) {
    console.error(`Нет файла ${file}.\nФормат строки:  <ключ> <прямая ссылка на изображение>`);
    process.exit(1);
  }
  const lines = (await readFile(file, 'utf8')).split('\n')
    .map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  for (const line of lines) {
    const [key, url] = line.split(/\s+/);
    if (!key || !url) { console.warn(`пропуск строки: ${line}`); continue; }
    if (!IMAGES[key]) { console.warn(`неизвестный ключ: ${key}`); failed++; continue; }
    if (existing.has(key) && !FORCE) { console.log(`= ${key} — файл уже есть`); skipped++; continue; }
    try {
      const r = await download(url, key);
      console.log(`+ ${key}.${r.ext}  ${(r.bytes / 1024).toFixed(0)} КБ`);
      ok++;
    } catch (e) { console.error(`! ${key}: ${e.message}`); failed++; }
  }
  console.log(`\nЗагружено ${ok}, пропущено ${skipped}, ошибок ${failed}`);
  process.exit(failed ? 1 : 0);
}

/* ---------- Режим 2: поиск через Unsplash API ---------- */
const KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!KEY) {
  console.error('Не задан UNSPLASH_ACCESS_KEY.');
  console.error('Получите бесплатный Access Key: зарегистрируйте приложение в кабинете разработчика Unsplash.');
  console.error('Затем:  UNSPLASH_ACCESS_KEY=xxx node scripts/fetch-photos.mjs');
  console.error('Либо используйте ручной режим: node scripts/fetch-photos.mjs --from-list');
  process.exit(1);
}

const api = async (path) => {
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      headers: { Authorization: `Client-ID ${KEY}`, 'Accept-Version': 'v1' }
    });
  } catch (e) {
    throw new Error(`не удалось соединиться с api.unsplash.com (${e.message}). Проверьте сеть, VPN или корпоративный прокси.`);
  }
  if (res.status === 401) throw new Error('Unsplash отклонил ключ (401). Проверьте UNSPLASH_ACCESS_KEY.');
  if (res.status === 403) {
    // Лимит Unsplash всегда сопровождается заголовком x-ratelimit-remaining.
    // Если его нет — 403 пришёл не от Unsplash, а от прокси или фаервола.
    const left = res.headers.get('x-ratelimit-remaining');
    throw new Error(left !== null
      ? `исчерпан лимит запросов Unsplash (осталось ${left}). Подождите час или используйте --only.`
      : 'доступ к api.unsplash.com заблокирован (403 без заголовков Unsplash) — скорее всего сетевой прокси или фаервол.');
  }
  if (!res.ok) throw new Error(`Unsplash ответил ${res.status}`);
  return res.json();
};

for (const s of slots) {
  if (existing.has(s.key) && !FORCE) { console.log(`= ${s.key} — файл уже есть`); skipped++; continue; }
  try {
    const q = new URLSearchParams({
      query: s.query, orientation: s.orientation,
      per_page: String(PICK + 5), content_filter: 'high'
    });
    const data = await api(`/search/photos?${q}`);
    const photo = (data.results || [])[PICK];
    if (!photo) throw new Error(`ничего не найдено по запросу «${s.query}»`);

    // Unsplash требует отметить скачивание через links.download_location
    if (photo.links && photo.links.download_location) {
      try { await api(photo.links.download_location.replace(API, '')); } catch { /* не критично */ }
    }

    const url = `${photo.urls.raw}&w=${s.w}&h=${s.h}&fit=crop&crop=entropy&q=82&fm=jpg`;
    const r = await download(url, s.key);
    const author = (photo.user && photo.user.name) || 'Unsplash';
    const link = (photo.user && photo.user.links && photo.user.links.html) || 'https://unsplash.com';
    credits.push({ key: s.key, author, link, page: photo.links && photo.links.html, alt: photo.alt_description || '' });
    console.log(`+ ${s.key}.${r.ext}  ${s.w}×${s.h}  ${(r.bytes / 1024).toFixed(0)} КБ  © ${author}`);
    ok++;
  } catch (e) {
    console.error(`! ${s.key}: ${e.message}`);
    failed++;
  }
}

if (credits.length) {
  const utm = '?utm_source=lumenvet&utm_medium=referral';
  const md = [
    '# Авторы фотографий',
    '',
    'Фотографии загружены с Unsplash. Указание авторства не обязательно по лицензии,',
    'но рекомендовано правилами Unsplash при использовании API.',
    '',
    '| Слот | Автор | Фотография |',
    '|---|---|---|',
    ...credits.map((c) => `| \`${c.key}\` | [${c.author}](${c.link}${utm}) | ${c.page ? `[ссылка](${c.page}${utm})` : '—'} |`),
    ''
  ].join('\n');
  const file = join(OUT, 'CREDITS.md');
  const prev = existsSync(file) ? await readFile(file, 'utf8') : '';
  await writeFile(file, prev && !FORCE ? `${prev}\n${md}` : md);
  console.log(`\nСписок авторов записан в src/photos/CREDITS.md`);
}

console.log(`\nЗагружено ${ok}, пропущено ${skipped}, ошибок ${failed}`);
console.log('Дальше: npm run build');
process.exit(failed ? 1 : 0);
