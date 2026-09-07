import { clinic, nav } from '../data/clinic.mjs';
import { services } from '../data/services.mjs';
import { esc, attr, jsonld } from './html.mjs';
import { icon } from './icons.mjs';
import { logoMark } from './images.mjs';

const CSS_VER = 'v1';

export const localBusinessLd = () => ({
  '@context': 'https://schema.org',
  '@type': ['VeterinaryCare', 'MedicalBusiness', 'LocalBusiness'],
  '@id': clinic.site + '/#clinic',
  name: clinic.name,
  alternateName: clinic.nameRu,
  legalName: clinic.legalName,
  description: 'Круглосуточная ветеринарная клиника: терапия, хирургия, диагностика, стационар и экстренная помощь 24/7.',
  url: clinic.site + '/',
  telephone: clinic.phone,
  email: clinic.email,
  image: clinic.site + '/assets/og/default.svg',
  logo: clinic.site + '/assets/favicon.svg',
  priceRange: '₽₽',
  currenciesAccepted: 'RUB',
  paymentAccepted: 'Наличные, банковская карта',
  foundingDate: String(clinic.founded),
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Пресненская набережная, 12',
    addressLocality: clinic.city,
    postalCode: clinic.postalCode,
    addressCountry: 'RU'
  },
  geo: { '@type': 'GeoCoordinates', latitude: clinic.geo.lat, longitude: clinic.geo.lng },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00', closes: '23:59'
  }],
  availableService: services.map((s) => ({
    '@type': 'MedicalProcedure', name: s.title, url: `${clinic.site}/services/${s.slug}/`
  })),
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '412', bestRating: '5' },
  sameAs: clinic.socials.map((s) => s.href)
});

const breadcrumbLd = (crumbs, site) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem', position: i + 1, name: c.label,
    item: site + (c.href || '')
  }))
});

export function breadcrumbs(crumbs) {
  return `<nav aria-label="Хлебные крошки"><ol class="crumbs">${crumbs.map((c, i) => {
    const last = i === crumbs.length - 1;
    return `<li>${last ? `<span aria-current="page">${esc(c.label)}</span>` : `<a href="${attr(c.href)}">${esc(c.label)}</a>`}</li>`;
  }).join('')}</ol></nav>`;
}

const header = (active, darkTop) => `
<header class="header${darkTop ? ' header--dark' : ''}" id="header"${darkTop ? ' data-theme="dark"' : ''}>
  <div class="container header__bar">
    <a class="logo" href="/" aria-label="${attr(clinic.name)} — на главную">
      ${logoMark()}
      <span class="logo__text"><b>LUMEN VET</b><span>Ветклиника 24/7</span></span>
    </a>
    <nav class="header__nav" aria-label="Основная навигация">
      ${nav.map((n) => `<a class="nav-link" href="${attr(n.href)}"${active === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('')}
    </nav>
    <div class="header__actions">
      <a class="header__phone" href="tel:${attr(clinic.phoneHref)}">
        <b>${esc(clinic.phone)}</b>
        <span><i class="pulse-dot" aria-hidden="true"></i>Круглосуточно</span>
      </a>
      <a class="btn btn--danger btn--s" href="/contacts/#emergency" aria-label="Срочная помощь круглосуточно">${icon('siren')}<span>Срочная помощь 24/7</span></a>
      <a class="btn btn--primary btn--s btn--book-desktop" href="/booking/" data-magnetic>Записаться на приём</a>
      <button class="burger" id="burger" type="button" aria-label="Меню" aria-expanded="false" aria-controls="drawer"><i></i><i></i><i></i></button>
    </div>
  </div>
</header>
<div class="drawer" id="drawer">
  <nav class="drawer__nav" aria-label="Мобильная навигация">
    ${nav.map((n, i) => `<a class="drawer__link" href="${attr(n.href)}" style="--i:${i}">${esc(n.label)}${icon('arrowUpRight', 'ico')}</a>`).join('')}
  </nav>
  <div class="drawer__foot">
    <a class="drawer__contact" href="tel:${attr(clinic.phoneHref)}">
      <span class="tiny" style="letter-spacing:.14em;text-transform:uppercase;color:#8FD8CB">Круглосуточно</span>
      <b style="font-size:1.4rem;font-weight:700">${esc(clinic.phone)}</b>
      <span class="small" style="color:#A9C2C0">${esc(clinic.address)}</span>
    </a>
    <a class="btn btn--primary btn--block" href="/booking/">Записаться на приём</a>
    <a class="btn btn--danger btn--block" href="/contacts/#emergency">${icon('siren')}Срочная помощь 24/7</a>
    <a class="btn btn--glass btn--block" href="${attr(clinic.routes.yandex)}" target="_blank" rel="noopener">${icon('route')}Построить маршрут</a>
  </div>
</div>`;

const footer = () => `
<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div>
        <a class="logo" href="/" aria-label="${attr(clinic.name)}">
          ${logoMark()}
          <span class="logo__text"><b>LUMEN VET</b><span>Ветклиника 24/7</span></span>
        </a>
        <p class="small" style="margin-top:1.1rem;max-width:34ch;color:#A9C2C0">${esc(clinic.claim)} Круглосуточная помощь, современная диагностика и врачи, которым доверяют самое дорогое.</p>
        <div class="footer__socials" style="margin-top:1.4rem">
          ${clinic.socials.map((s) => `<a href="${attr(s.href)}" target="_blank" rel="noopener nofollow" aria-label="${attr(s.label)}">${icon(s.icon)}</a>`).join('')}
        </div>
      </div>
      <div>
        <div class="footer__title">Разделы</div>
        <ul class="footer__list">
          ${nav.map((n) => `<li><a href="${attr(n.href)}">${esc(n.label)}</a></li>`).join('')}
          <li><a href="/promo/">Акции</a></li>
          <li><a href="/faq/">Вопросы и ответы</a></li>
          <li><a href="/booking/">Онлайн-запись</a></li>
        </ul>
      </div>
      <div>
        <div class="footer__title">Услуги</div>
        <ul class="footer__list">
          ${services.map((s) => `<li><a href="/services/${attr(s.slug)}/">${esc(s.title)}</a></li>`).join('')}
        </ul>
      </div>
      <div>
        <div class="footer__title">Контакты</div>
        <ul class="footer__list">
          <li><a href="tel:${attr(clinic.phoneHref)}" style="font-size:1.3rem;font-weight:700;letter-spacing:-.02em">${esc(clinic.phone)}</a></li>
          <li><span style="color:#8FD8CB;font-weight:700">Круглосуточно · без выходных</span></li>
          <li>${esc(clinic.address)}</li>
          <li>${esc(clinic.metro)}</li>
          <li>${esc(clinic.parking)}</li>
          <li><a href="mailto:${attr(clinic.email)}">${esc(clinic.email)}</a></li>
        </ul>
        <div class="row" style="margin-top:1.1rem">
          <a class="btn btn--primary btn--s" href="/booking/">Записаться</a>
          <a class="btn btn--glass btn--s" href="${attr(clinic.routes.yandex)}" target="_blank" rel="noopener">Маршрут</a>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© ${new Date().getFullYear()} ${esc(clinic.legalName)}. Все права защищены.</span>
      <span style="max-width:60ch">Информация на сайте не является публичной офертой и не заменяет консультацию врача.</span>
      <span class="row" style="gap:1.2rem">
        <a href="/privacy/">Политика конфиденциальности</a>
        <a href="/about/#documents">Лицензии и документы</a>
      </span>
    </div>
  </div>
</footer>`;

const mobileBar = () => `
<div class="mobile-bar" id="mobilebar">
  <div class="mobile-bar__grid">
    <a class="is-call" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}Позвонить</a>
    <a class="is-book" href="/booking/">${icon('calendar')}Записаться</a>
    <a href="${attr(clinic.routes.yandex)}" target="_blank" rel="noopener">${icon('route')}Маршрут</a>
  </div>
</div>
<a class="sos" id="sos" href="/contacts/#emergency">${icon('siren')}Срочная помощь 24/7</a>
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр фотографии">
  <button class="lightbox__close" type="button" aria-label="Закрыть">${icon('close')}</button>
  <button class="lightbox__nav prev" type="button" aria-label="Предыдущее фото">${icon('arrowLeft')}</button>
  <button class="lightbox__nav next" type="button" aria-label="Следующее фото">${icon('arrow')}</button>
  <div><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E" alt=""><p class="lightbox__cap"></p></div>
</div>`;

/**
 * Собирает готовую HTML-страницу.
 */
export function page({
  title, description, path, active, crumbs = [], body,
  darkTop = false, ld = [], ogKey = 'default', bodyClass = ''
}) {
  const canonical = clinic.site + path;
  const og = `${clinic.site}/assets/og/${ogKey}.svg`;
  const schemas = [localBusinessLd(), ...ld];
  if (crumbs.length > 1) schemas.push(breadcrumbLd(crumbs, clinic.site));

  return `<!doctype html>
<html lang="ru" class="is-loading">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${attr(canonical)}">
<meta name="theme-color" content="#071E21">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${attr(clinic.name)}">
<meta property="og:locale" content="ru_RU">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${attr(canonical)}">
<meta property="og:image" content="${attr(og)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(title)}">
<meta name="twitter:description" content="${attr(description)}">
<meta name="twitter:image" content="${attr(og)}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/favicon.svg">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap"></noscript>
<script>document.documentElement.classList.add('js');setTimeout(function(){var h=document.documentElement,p=document.getElementById('preloader');h.classList.remove('is-loading');if(p)p.classList.add('is-done');},5000);</script>
<link rel="stylesheet" href="/assets/styles.css?${CSS_VER}">
${schemas.map(jsonld).join('\n')}
</head>
<body${bodyClass ? ` class="${attr(bodyClass)}"` : ''}>
<a class="skip-link" href="#main">Перейти к содержанию</a>
<div class="preloader" id="preloader" aria-hidden="true">
  <div class="preloader__inner">
    <canvas width="190" height="190"></canvas>
    <div class="preloader__word">LUMEN VET</div>
    <div class="preloader__bar"><i></i></div>
  </div>
</div>
<div class="scroll-progress" id="progress" aria-hidden="true"></div>
<div class="cursor-glow" id="glow" aria-hidden="true"></div>
${header(active, darkTop)}
<main id="main">
${body}
</main>
${footer()}
${mobileBar()}
<script src="/assets/app.js?${CSS_VER}" defer></script>
</body>
</html>`;
}
