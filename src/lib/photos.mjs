/* Подключение реальных фотографий.
   Кладите файлы в src/photos/ с именем = ключ изображения из IMAGES
   (src/lib/images.mjs), например: src/photos/hero-main.jpg
   Поддерживаются .avif, .webp, .jpg, .jpeg, .png — для одного ключа можно
   положить несколько форматов, тогда в разметку попадёт <picture> с
   AVIF → WebP → растровым фолбэком. Для ключей без файла остаётся
   сгенерированный SVG-плейсхолдер. */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('../photos/', import.meta.url));
const EXT = /^(.+)\.(avif|webp|jpe?g|png)$/i;
const MIME = { avif: 'image/avif', webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };
// Порядок для <img src>: то, что понимает вообще всё
const RASTER_ORDER = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

/** Читает размеры PNG / JPEG / WebP без зависимостей. null, если не удалось. */
function readSize(file) {
  let b;
  try { b = readFileSync(file); } catch { return null; }
  // PNG
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
    return [b.readUInt32BE(16), b.readUInt32BE(20)];
  }
  // WebP (VP8X / VP8 / VP8L)
  if (b.length > 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    if (chunk === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (chunk === 'VP8L') {
      const n = b.readUInt32LE(21);
      return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)];
    }
  }
  // JPEG: идём по сегментам до SOFn
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      }
      i += 2 + len;
    }
  }
  return null;
}

function scan() {
  let files = [];
  try { files = readdirSync(DIR); } catch { return new Map(); }
  const map = new Map();
  for (const name of files) {
    const m = EXT.exec(name);
    if (!m) continue;
    const key = m[1];
    const ext = m[2].toLowerCase();
    if (!map.has(key)) map.set(key, { key, files: [] });
    map.get(key).files.push({ ext, name, mime: MIME[ext] });
  }
  for (const entry of map.values()) {
    const raster = RASTER_ORDER.map((e) => entry.files.find((f) => f.ext === e)).find(Boolean);
    entry.fallback = raster || entry.files[0];
    entry.sources = ['avif', 'webp']
      .map((e) => entry.files.find((f) => f.ext === e))
      .filter((f) => f && f !== entry.fallback);
    entry.size = readSize(DIR + entry.fallback.name);
  }
  return map;
}

/** key -> { files, fallback, sources, size } для всех найденных фотографий. */
export const photos = scan();
export const photoDir = DIR;
export const hasPhoto = (key) => photos.has(key);
