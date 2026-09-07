import { clinic } from '../data/clinic.mjs';
import { services } from '../data/services.mjs';
import { doctors, doctorBySlug } from '../data/doctors.mjs';
import { emergencyCases, usp, equipment, stories, gallery, reviews, promos, faq } from '../data/content.mjs';
import { posts, categories } from '../data/posts.mjs';
import { esc, attr, img, money, dateRu, plural } from './html.mjs';
import { icon } from './icons.mjs';

/* ---------- Стилизованная карта (без внешних API и ключей) ---------- */
export function vmap({ big = false } = {}) {
  const blocks = [
    [18, 26, 46, 30], [74, 18, 40, 24], [126, 30, 52, 28], [16, 74, 38, 34],
    [66, 62, 44, 26], [122, 74, 56, 30], [22, 124, 40, 26], [78, 118, 36, 28],
    [128, 122, 48, 26], [186, 60, 34, 40], [186, 118, 30, 30]
  ];
  return `<svg viewBox="0 0 240 170" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Схема расположения клиники: Пресненская набережная, 12">
<defs>
  <linearGradient id="mapbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#062123"/><stop offset="1" stop-color="#0B3436"/></linearGradient>
  <linearGradient id="river" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0F827E" stop-opacity=".55"/><stop offset="1" stop-color="#159A93" stop-opacity=".3"/></linearGradient>
  <radialGradient id="mapglow" cx="62%" cy="56%" r="46%"><stop offset="0" stop-color="#6FE0D0" stop-opacity=".26"/><stop offset="1" stop-color="#6FE0D0" stop-opacity="0"/></radialGradient>
</defs>
<rect width="240" height="170" fill="url(#mapbg)"/>
<g fill="#0E3B3D" opacity=".85">${blocks.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>`).join('')}</g>
<g stroke="#12484A" stroke-width="5" stroke-linecap="round" fill="none">
  <path d="M0 58h240M0 110h240M68 0v170M182 0v170"/>
</g>
<g stroke="#1A5C5D" stroke-width="1.6" fill="none" opacity=".9">
  <path d="M0 34h240M0 84h240M0 146h240M34 0v170M114 0v170M212 0v170"/>
</g>
<path d="M-10 148C40 132 74 154 118 138s72-34 132-16" stroke="url(#river)" stroke-width="17" fill="none" stroke-linecap="round"/>
<rect width="240" height="170" fill="url(#mapglow)"/>
<path class="vmap__route" d="M18 158C56 152 74 132 96 118s28-24 44-30" stroke="#6FE0D0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".95"/>
<g transform="translate(140 88)">
  <circle class="vmap__ring" r="6" fill="none" stroke="#6FE0D0" stroke-width="1.4"/>
  <g class="vmap__pin">
    <path d="M0-15c6.6 0 12 5.2 12 11.8C12 5.5 0 17 0 17S-12 5.5-12-3.2C-12-9.8-6.6-15 0-15Z" fill="#159A93" stroke="#A6F0E4" stroke-width="1.6"/>
    <circle cy="-3" r="4.2" fill="#04191B"/>
  </g>
</g>
<g transform="translate(18 152)"><circle r="5" fill="#0B3436" stroke="#6FE0D0" stroke-width="1.4"/><path d="M-2.4 1.6 0-3l2.4 4.6" stroke="#6FE0D0" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>
${big ? `<g font-family="Manrope,sans-serif" font-size="7" fill="#8FD8CB" letter-spacing=".6">
  <text x="150" y="82">Клиника · Пресненская наб., 12</text>
  <text x="10" y="142">м. Выставочная</text>
  <text x="8" y="24" fill="#5E8E8C">Пресненский район</text>
  <text x="176" y="164" fill="#5E8E8C">Москва-река</text>
</g>` : ''}
</svg>`;
}

export const routeButtons = (size = 's') => `
<a class="btn btn--primary btn--${size}" href="${attr(clinic.routes.yandex)}" target="_blank" rel="noopener">${icon('route')}Построить маршрут</a>
<a class="btn btn--ghost btn--${size}" href="${attr(clinic.routes.google)}" target="_blank" rel="noopener">Google Maps</a>`;

export function routeCard() {
  return `<div class="routecard" data-reveal="scale">
  <div class="routecard__map">${vmap()}</div>
  <div class="routecard__body">
    <div class="eyebrow is-plain" style="font-size:.7rem">Как нас найти</div>
    <div class="routecard__row">${icon('pin')}<div><b>${esc(clinic.addressShort)}</b><span>Вход с набережной, 1 этаж</span></div></div>
    <div class="routecard__row">${icon('metro')}<div><b>м. Выставочная — 4 мин</b><span>Деловой центр — 6 мин пешком</span></div></div>
    <div class="routecard__row">${icon('car')}<div><b>Подземный паркинг</b><span>Первые 60 минут бесплатно</span></div></div>
    <div class="routecard__cta">
      <a class="btn btn--primary btn--xs" href="${attr(clinic.routes.yandex)}" target="_blank" rel="noopener">${icon('route')}Маршрут</a>
      <a class="btn btn--glass btn--xs" href="/contacts/">Все контакты</a>
    </div>
  </div>
</div>`;
}

/* ---------- Экстренная помощь ---------- */
export function emergencySection() {
  return `<section class="section section--tight emergency surface" id="emergency" aria-labelledby="emg-t">
  <div class="container">
    <div class="emergency__inner" data-reveal>
      <div class="emergency__top">
        <div class="stack stack-m">
          <span class="chip chip--danger"><i class="pulse-dot" aria-hidden="true"></i>Экстренная помощь</span>
          <h2 class="h2" id="emg-t" style="color:#fff">Нужна помощь<br><em>прямо сейчас?</em></h2>
          <p class="lead" style="color:#BFD5D3;max-width:46ch">Мы работаем круглосуточно и принимаем пациентов в экстренных ситуациях 24/7. Позвоните по дороге — бригада подготовит место в реанимации и встретит вас у входа.</p>
        </div>
        <div class="stack stack-s">
          <div class="emergency__cta">
            <a class="btn btn--danger btn-phone" href="tel:${attr(clinic.phoneHref)}" data-magnetic>${icon('phone')}Позвонить сейчас</a>
            <a class="btn btn--glass" href="/contacts/">${icon('pin')}Как нас найти</a>
            <a class="btn btn--glass" href="${attr(clinic.routes.yandex)}" target="_blank" rel="noopener">${icon('route')}Построить маршрут</a>
          </div>
          <p class="small" style="color:#8AA4A2">Без записи · вне очереди · круглосуточно, включая праздники</p>
        </div>
      </div>
      <div class="emergency__cases" data-stagger>
        ${emergencyCases.map((c) => `<div class="ecase">${icon(c.icon)}<div><b>${esc(c.t)}</b><span>${esc(c.d)}</span></div></div>`).join('')}
      </div>
    </div>
  </div>
</section>`;
}

/* ---------- Преимущества ---------- */
export function uspSection() {
  return `<section class="section surface" aria-labelledby="usp-t">
  <div class="container">
    <div class="section-head section-head--split">
      <div class="section-head__text" data-reveal>
        <span class="eyebrow">Почему нам доверяют</span>
        <h2 class="h2" id="usp-t">Клиника, в которой есть <em>всё необходимое</em> — и ночью тоже</h2>
      </div>
      <a class="link" href="/about/">О клинике ${icon('arrow', 'ico arr')}</a>
    </div>
    <div class="usp" data-stagger>
      ${usp.map((u) => `<article class="usp__item">
        <div class="usp__ico">${icon(u.icon)}</div>
        <div class="usp__value">${esc(u.value)}</div>
        <h3>${esc(u.title)}</h3>
        <p>${esc(u.text)}</p>
      </article>`).join('')}
    </div>
  </div>
</section>`;
}

/* ---------- Услуги ---------- */
export function serviceCard(s) {
  return `<a class="svc" href="/services/${attr(s.slug)}/" data-tilt="4">
  <div class="svc__media">${img(s.image, `${s.title} — ${clinic.name}`)}<span class="iplate svc__ico">${icon(s.icon)}</span></div>
  <div class="svc__body">
    <div class="svc__title"><h3>${esc(s.title)}</h3><span class="svc__price">от ${money(s.priceFrom)}</span></div>
    <p class="svc__text">${esc(s.lead)}</p>
    <ul class="svc__list">${s.items.slice(0, 3).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    <span class="svc__more">Подробнее ${icon('arrow', 'ico arr')}</span>
  </div>
</a>`;
}

export function servicesSection(limit) {
  const list = limit ? services.slice(0, limit) : services;
  return `<section class="section surface" id="services" aria-labelledby="svc-t">
  <div class="container">
    <div class="section-head section-head--split">
      <div class="section-head__text" data-reveal>
        <span class="eyebrow">Направления</span>
        <h2 class="h2" id="svc-t">Всё необходимое для здоровья вашего питомца — <em>в одной клинике</em></h2>
        <p class="lead">Девять направлений, общая карта пациента и врачи, которые обсуждают сложные случаи вместе.</p>
      </div>
      ${limit ? `<a class="btn btn--ghost" href="/services/">Все услуги ${icon('arrow', 'ico arr')}</a>` : ''}
    </div>
    <div class="services" data-stagger>${list.map(serviceCard).join('')}</div>
  </div>
</section>`;
}

/* ---------- Технологии ---------- */
export function techSection() {
  return `<section class="section surface" data-surface="dark" aria-labelledby="tech-t">
  <span class="orb orb--a" aria-hidden="true"></span><span class="orb orb--b" aria-hidden="true"></span>
  <div class="container">
    <div class="section-head" data-reveal>
      <span class="eyebrow">Технологии и оборудование</span>
      <h2 class="h2" id="tech-t">Современная ветеринария — это <em>точная диагностика</em></h2>
      <p class="lead">Собственная лаборатория, УЗИ экспертного класса и мониторинг витальных функций на каждой операции. Наведите на карточку, чтобы узнать подробности.</p>
    </div>
    <div class="tech" data-stagger>
      ${equipment.map((e, i) => `<article class="tech__item" tabindex="0">
        ${img(e.image, e.title, { class: 'tech__img' })}
        <span class="tech__scan" aria-hidden="true"><i></i><b></b></span>
        <span class="tech__marker" style="left:${18 + (i % 3) * 22}%;top:${28 + (i % 2) * 18}%"></span>
        <span class="tech__marker" style="left:${58 + (i % 2) * 14}%;top:${46 + (i % 3) * 10}%"></span>
        <div class="tech__body">
          <span class="chip chip--accent" style="align-self:flex-start">${esc(e.tag)}</span>
          <h3>${esc(e.title)}</h3>
          <p>${esc(e.text)}</p>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>`;
}

/* ---------- Истории пациентов ---------- */
export function storiesSection() {
  return `<section class="section surface" aria-labelledby="st-t" data-slider>
  <div class="container">
    <div class="section-head section-head--split">
      <div class="section-head__text" data-reveal>
        <span class="eyebrow">Истории пациентов</span>
        <h2 class="h2" id="st-t">Истории, которые <em>заканчиваются хорошо</em></h2>
        <p class="lead">Реальные маршруты лечения: что случилось, что мы сделали и чем всё закончилось.</p>
      </div>
      <div class="slider__nav">
        <span class="slider__rail"><i></i></span>
        <button class="sbtn" type="button" data-slider-prev aria-label="Предыдущая история">${icon('arrowLeft')}</button>
        <button class="sbtn" type="button" data-slider-next aria-label="Следующая история">${icon('arrow')}</button>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="slider__track">
      ${stories.map((s) => `<article class="story">
        <div class="story__media">${img(s.image, `${s.name} — ${s.kind}`)}<span class="chip chip--accent story__badge">${esc(s.kind)}</span></div>
        <div class="story__body">
          <div class="story__name"><h3>${esc(s.name)}</h3><span>${esc(s.age)}</span></div>
          <dl class="stack stack-s" style="margin:0">
            <div class="story__block"><dt>Проблема</dt><dd>${esc(s.problem)}</dd></div>
            <div class="story__block"><dt>Лечение</dt><dd>${esc(s.treatment)}</dd></div>
            <div class="story__block"><dt>Результат</dt><dd>${esc(s.result)}</dd></div>
          </dl>
          <ul class="story__steps">${s.steps.map((x) => `<li>${icon('check', 'ico')}${esc(x)}</li>`).join('')}</ul>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>`;
}

/* ---------- Галерея ---------- */
export function gallerySection() {
  return `<section class="section surface surface--alt" aria-labelledby="gal-t">
  <div class="container">
    <div class="section-head" data-reveal>
      <span class="eyebrow">Галерея</span>
      <h2 class="h2" id="gal-t">Наши пациенты и <em>наша клиника</em></h2>
    </div>
    <div class="masonry">
      ${gallery.map((g) => `<figure data-lightbox data-caption="${attr(g.caption)}" data-full="/assets/img/${attr(g.image)}.svg" role="button" aria-label="Открыть фото: ${attr(g.caption)}">
        ${img(g.image, g.alt)}
        <figcaption>${esc(g.caption)}</figcaption>
      </figure>`).join('')}
    </div>
  </div>
</section>`;
}

/* ---------- Отзывы ---------- */
export function reviewsSection(limit) {
  const list = limit ? reviews.slice(0, limit) : reviews;
  const stars = (n) => `<span class="review__stars" aria-label="Оценка ${n} из 5">${Array.from({ length: n }, () => icon('star', 'ico')).join('')}</span>`;
  return `<section class="section surface surface--sand" id="reviews" aria-labelledby="rev-t">
  <div class="container">
    <div class="section-head section-head--split">
      <div class="section-head__text" data-reveal>
        <span class="eyebrow">Отзывы</span>
        <h2 class="h2" id="rev-t">Нам доверяют <em>самое дорогое</em></h2>
        <div class="rating-big"><b class="num">4.9</b><div><div class="review__stars">${Array.from({ length: 5 }, () => icon('star', 'ico')).join('')}</div><span class="small muted">412 отзывов за 12 месяцев</span></div></div>
      </div>
      <div class="row">
        <a class="btn btn--ghost btn--s" href="/reviews/#leave">Оставить отзыв</a>
        ${limit ? `<a class="link" href="/reviews/">Все отзывы ${icon('arrow', 'ico arr')}</a>` : ''}
      </div>
    </div>
    <div class="reviews" data-stagger>
      ${list.map((r) => `<article class="review">
        <div class="review__head">
          ${img(r.image, `Питомец: ${r.pet}`, { class: 'review__ava' })}
          <div class="review__who"><b>${esc(r.name)}</b><span>${esc(r.pet)}</span></div>
        </div>
        <p class="review__text">${esc(r.text)}</p>
        <div class="review__foot">${stars(r.rate)}<time datetime="${attr(r.date)}">${esc(dateRu(r.date))}</time></div>
      </article>`).join('')}
    </div>
  </div>
</section>`;
}

/* ---------- Акции ---------- */
export function promoSection(limit) {
  const list = limit ? promos.slice(0, limit) : promos;
  return `<section class="section surface" id="promo" aria-labelledby="promo-t">
  <div class="container">
    <div class="section-head section-head--split">
      <div class="section-head__text" data-reveal>
        <span class="eyebrow">Акции и программы</span>
        <h2 class="h2" id="promo-t">Забота — это ещё и <em>профилактика</em></h2>
        <p class="lead">Комплексные программы стоят дешевле, чем те же процедуры по отдельности, и помогают находить проблемы до появления симптомов.</p>
      </div>
      ${limit ? `<a class="btn btn--ghost" href="/promo/">Все предложения ${icon('arrow', 'ico arr')}</a>` : ''}
    </div>
    <div class="promos" data-stagger>
      ${list.map((p) => `<article class="promo">
        <span class="chip chip--sand" style="align-self:flex-start">${esc(p.tag)}</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.text)}</p>
        <div class="promo__price"><span class="promo__now">${esc(money(p.now))}</span><s class="promo__old">${esc(money(p.old))}</s></div>
        <p class="tiny muted">${esc(p.note)}</p>
        <a class="btn btn--ghost btn--xs" href="/booking/?service=${attr(p.service)}" style="align-self:flex-start">Записаться</a>
      </article>`).join('')}
    </div>
  </div>
</section>`;
}

/* ---------- Блог ---------- */
export function postCard(p, feature = false) {
  const cat = categories.find((c) => c.id === p.cat);
  return `<a class="post-card${feature ? ' post-card--feature' : ''}" href="/blog/${attr(p.slug)}/" data-cat="${attr(p.cat)}">
  <div class="post-card__media">${img(p.image, p.title)}</div>
  <div class="post-card__meta"><span class="post-card__cat">${esc(cat ? cat.label : '')}</span><span>·</span><time datetime="${attr(p.date)}">${esc(dateRu(p.date))}</time><span>·</span><span>${esc(plural(p.read, 'минута', 'минуты', 'минут'))} чтения</span></div>
  <h3>${esc(p.title)}</h3>
  <p>${esc(p.excerpt)}</p>
</a>`;
}

export function blogSection(limit = 3) {
  return `<section class="section surface surface--alt" aria-labelledby="blog-t">
  <div class="container">
    <div class="section-head section-head--split">
      <div class="section-head__text" data-reveal>
        <span class="eyebrow">Блог</span>
        <h2 class="h2" id="blog-t">Полезно знать <em>каждому владельцу</em></h2>
      </div>
      <a class="btn btn--ghost" href="/blog/">Все статьи ${icon('arrow', 'ico arr')}</a>
    </div>
    <div class="posts" data-stagger>${posts.slice(0, limit).map((p) => postCard(p)).join('')}</div>
  </div>
</section>`;
}

/* ---------- FAQ ---------- */
export function faqBlock(list, id = 'faq') {
  return `<div class="faq" data-accordion="single" id="${attr(id)}">
  ${list.map((f, i) => `<div class="faq__item">
    <button class="faq__q" type="button" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="${id}-a${i}" id="${id}-q${i}">
      <span>${esc(f.q)}</span><span class="faq__sign" aria-hidden="true"></span>
    </button>
    <div class="faq__a" id="${id}-a${i}" role="region" aria-labelledby="${id}-q${i}"><div><p>${esc(f.a)}</p></div></div>
  </div>`).join('')}
</div>`;
}

export function faqSection(list = faq.slice(0, 10), showAll = true) {
  return `<section class="section surface" id="faq" aria-labelledby="faq-t">
  <div class="container two-col">
    <div class="sticky-side stack stack-m" data-reveal="left">
      <span class="eyebrow">Частые вопросы</span>
      <h2 class="h2" id="faq-t">Отвечаем на то, что <em>спрашивают чаще всего</em></h2>
      <p class="lead">Не нашли свой вопрос? Напишите нам — врач ответит в течение рабочего дня, а в экстренной ситуации звоните круглосуточно.</p>
      <div class="row">
        <a class="btn btn--primary btn--s" href="/contacts/#ask">Задать вопрос</a>
        <a class="btn btn--ghost btn--s btn-phone" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}${esc(clinic.phone)}</a>
      </div>
      ${showAll ? `<a class="link" href="/faq/">Все вопросы и ответы ${icon('arrow', 'ico arr')}</a>` : ''}
    </div>
    <div data-reveal="right">${faqBlock(list)}</div>
  </div>
</section>`;
}

export const faqLd = (list) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: list.map((f) => ({
    '@type': 'Question', name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
});

/* ---------- Врачи ---------- */
export function doctorCard(d) {
  return `<a class="doccard tilt" href="/doctors/${attr(d.slug)}/" data-tilt="7">
  <div class="doccard__media">
    ${img(d.image, `${d.name} — ${d.role}`)}
    <span class="chip chip--accent doccard__exp">${esc(plural(d.exp, 'год', 'года', 'лет'))} опыта</span>
    <div class="doccard__over"><b>${esc(d.name)}</b><span>${esc(d.role)}</span></div>
  </div>
  <div class="doccard__body">
    <p>${esc(d.short)}</p>
    <ul class="doctags">${d.focus.slice(0, 3).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
  </div>
</a>`;
}

export function doctorsSection(limit) {
  const list = limit ? doctors.slice(0, limit) : doctors;
  return `<section class="section surface" data-surface="dark" id="doctors" aria-labelledby="doc-t">
  <span class="orb orb--c" aria-hidden="true"></span>
  <div class="container">
    <div class="section-head section-head--split">
      <div class="section-head__text" data-reveal>
        <span class="eyebrow">Команда</span>
        <h2 class="h2" id="doc-t">Люди, которым вы доверяете <em>самое дорогое</em></h2>
        <p class="lead">Девять специализаций, общие разборы сложных случаев и врач, который остаётся с вами на связи после визита.</p>
      </div>
      ${limit ? `<a class="btn btn--glass" href="/doctors/">Все врачи ${icon('arrow', 'ico arr')}</a>` : ''}
    </div>
    <div class="docs" data-stagger>${list.map(doctorCard).join('')}</div>
  </div>
</section>`;
}

/* ---------- Форма «Задать вопрос» ---------- */
export function askForm({ compact = false } = {}) {
  return `<div class="form-card" id="ask">
  <form data-form="ask" novalidate>
    <div class="form-body stack stack-m">
      <div class="stack stack-xs">
        <span class="eyebrow">Плановое обращение</span>
        <h2 class="${compact ? 'h3' : 'h2'}">Есть вопрос о здоровье питомца?</h2>
        <p class="small muted">Ответим в течение рабочего дня. В экстренной ситуации — звоните по телефону круглосуточно.</p>
      </div>
      <div class="form-grid">
        <div class="field"><label for="ask-name">Ваше имя <span class="req">*</span></label><input class="input" id="ask-name" name="name" required autocomplete="name" placeholder="Как к вам обращаться"><span class="field__err">Укажите имя</span></div>
        <div class="field"><label for="ask-tel">Телефон <span class="req">*</span></label><input class="input" id="ask-tel" name="phone" type="tel" required autocomplete="tel" placeholder="+7 (___) ___-__-__"><span class="field__err">Укажите корректный телефон</span></div>
        <div class="field"><label for="ask-pet">Имя питомца</label><input class="input" id="ask-pet" name="pet" placeholder="Например, Барни"></div>
        <div class="field"><label for="ask-species">Вид животного</label>
          <select class="select" id="ask-species" name="species">
            <option>Собака</option><option>Кошка</option><option>Грызун или кролик</option><option>Птица</option><option>Другое</option>
          </select>
        </div>
        <div class="field full"><label for="ask-topic">Направление</label>
          <select class="select" id="ask-topic" name="topic">
            <option value="">Не знаю, нужна помощь с выбором</option>
            ${services.map((s) => `<option value="${attr(s.slug)}">${esc(s.title)}</option>`).join('')}
          </select>
        </div>
        <div class="field full"><label for="ask-q">Вопрос <span class="req">*</span></label><textarea class="textarea" id="ask-q" name="question" required placeholder="Опишите, что беспокоит питомца"></textarea><span class="field__err">Опишите вопрос</span></div>
        <div class="field full"><label>Удобный способ связи</label>
          <div class="choices">
            ${['Телефон', 'WhatsApp', 'Telegram', 'Email'].map((c, i) => `<label class="choice"><input type="radio" name="contact" value="${attr(c)}"${i === 0 ? ' checked' : ''}><span>${esc(c)}</span></label>`).join('')}
          </div>
        </div>
        <div class="full"><label class="checkbox"><input type="checkbox" required><span>Согласен на обработку персональных данных в соответствии с <a href="/privacy/">политикой конфиденциальности</a></span></label></div>
      </div>
      <button class="btn btn--primary btn--block" type="submit" data-magnetic>Получить консультацию</button>
    </div>
    <div class="form-success"><span class="tick">${icon('check')}</span><h3 class="h3">Заявка отправлена</h3><p class="soft">Администратор свяжется с вами в ближайшее время. Если ситуация экстренная — звоните: <a class="link" href="tel:${attr(clinic.phoneHref)}">${esc(clinic.phone)}</a></p></div>
  </form>
</div>`;
}

/* ---------- Финальный CTA ---------- */
export function finaleSection() {
  return `<section class="section finale" aria-labelledby="fin-t">
  ${img('finale', 'Врач с собакой в ветеринарной клинике', { class: 'finale__bg' })}
  <div class="container">
    <div class="finale__inner" data-reveal>
      <span class="chip chip--accent" style="align-self:flex-start"><i class="pulse-dot" aria-hidden="true"></i>Круглосуточно 24/7</span>
      <h2 id="fin-t">Пусть о здоровье вашего питомца <em>позаботятся профессионалы</em></h2>
      <p>Плановый приём или экстренная помощь — мы рядом 24/7.</p>
      <div class="row">
        <a class="btn btn--primary" href="/booking/" data-magnetic>${icon('calendar')}Записаться на приём</a>
        <a class="btn btn--light btn-phone" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}${esc(clinic.phone)}</a>
        <a class="btn btn--glass" href="${attr(clinic.routes.yandex)}" target="_blank" rel="noopener">${icon('route')}Построить маршрут</a>
      </div>
    </div>
  </div>
</section>`;
}

/* ---------- Контакты (блок) ---------- */
export function contactsSection() {
  return `<section class="section surface" id="contacts" aria-labelledby="con-t">
  <div class="container">
    <div class="section-head" data-reveal>
      <span class="eyebrow">Контакты</span>
      <h2 class="h2" id="con-t">Мы рядом, когда это <em>действительно важно</em></h2>
    </div>
    <div class="contacts">
      <div class="cinfo" data-reveal="left">
        <div class="cinfo__row"><span class="iplate iplate--s">${icon('phone')}</span><div><b>Телефон · круглосуточно</b><a class="big link" href="tel:${attr(clinic.phoneHref)}">${esc(clinic.phone)}</a></div></div>
        <div class="cinfo__row"><span class="iplate iplate--s">${icon('clock')}</span><div><b>Режим работы</b><p>Круглосуточно 24/7, без выходных и праздников. Экстренные пациенты — вне очереди и без записи.</p></div></div>
        <div class="cinfo__row"><span class="iplate iplate--s">${icon('pin')}</span><div><b>Адрес</b><p>${esc(clinic.address)}</p></div></div>
        <div class="cinfo__row"><span class="iplate iplate--s">${icon('metro')}</span><div><b>Метро</b><p>${esc(clinic.metro)}</p></div></div>
        <div class="cinfo__row"><span class="iplate iplate--s">${icon('car')}</span><div><b>Парковка</b><p>${esc(clinic.parking)}</p></div></div>
        <div class="cinfo__row"><span class="iplate iplate--s">${icon('chat')}</span><div><b>Мессенджеры и почта</b><p>${clinic.socials.map((s) => `<a class="link" href="${attr(s.href)}" target="_blank" rel="noopener nofollow">${esc(s.label)}</a>`).join(' · ')} · <a class="link" href="mailto:${attr(clinic.email)}">${esc(clinic.email)}</a></p></div></div>
        <div class="row">
          <a class="btn btn--primary btn--s" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}Позвонить</a>
          <a class="btn btn--ghost btn--s" href="${attr(clinic.routes.yandex)}" target="_blank" rel="noopener">${icon('route')}Построить маршрут</a>
          <a class="btn btn--ghost btn--s" href="/booking/">Записаться на приём</a>
        </div>
      </div>
      <div class="contacts__map vmap" data-reveal="right">
        ${vmap({ big: true })}
        <div class="vmap__overlay">${routeButtons('s')}</div>
      </div>
    </div>
  </div>
</section>`;
}

export { doctorBySlug, doctors, services, faq, categories, posts, reviews, promos, gallery };
