import { clinic } from '../data/clinic.mjs';
import { services, serviceBySlug } from '../data/services.mjs';
import { doctorBySlug } from '../data/doctors.mjs';
import { priceGroups } from '../data/prices.mjs';
import { page, breadcrumbs } from '../lib/layout.mjs';
import { esc, attr, img, money, plural } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { serviceCard, faqBlock, faqLd, finaleSection, doctorCard, emergencySection } from '../lib/blocks.mjs';

export function servicesIndex() {
  const crumbs = [{ label: 'Главная', href: '/' }, { label: 'Услуги', href: '/services/' }];
  return page({
    title: 'Услуги ветеринарной клиники в Москве — цены и направления | LUMEN VET',
    description: 'Терапия, хирургия, диагностика, вакцинация, стоматология, груминг, дерматология, кардиология и стационар. Девять направлений в одной круглосуточной клинике.',
    path: '/services/', active: '/services/', ogKey: 'services', crumbs,
    ld: [{
      '@context': 'https://schema.org', '@type': 'ItemList',
      itemListElement: services.map((s, i) => ({
        '@type': 'ListItem', position: i + 1, name: s.title, url: `${clinic.site}/services/${s.slug}/`
      }))
    }],
    body: `
<section class="pagehead surface" data-surface="dark">
  <span class="orb orb--a" aria-hidden="true"></span><span class="orb orb--c" aria-hidden="true"></span>
  <div class="container stack stack-m">
    ${breadcrumbs(crumbs)}
    <span class="eyebrow">Направления</span>
    <h1 class="h1 balance" style="max-width:20ch">Всё необходимое для здоровья вашего питомца — <em>в одной клинике</em></h1>
    <p class="lead" style="max-width:56ch">Девять направлений, общая электронная карта пациента и врачи, которые обсуждают сложные случаи вместе, а не пересылают вас друг к другу.</p>
    <div class="row">
      <a class="btn btn--primary" href="/booking/">${icon('calendar')}Записаться на приём</a>
      <a class="btn btn--glass btn-phone" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}${esc(clinic.phone)}</a>
    </div>
  </div>
</section>
<section class="section surface">
  <div class="container">
    <div class="services" data-stagger>${services.map(serviceCard).join('')}</div>
  </div>
</section>
${emergencySection()}
${finaleSection()}`
  });
}

export function servicePage(slug) {
  const s = serviceBySlug[slug];
  const crumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Услуги', href: '/services/' },
    { label: s.title, href: `/services/${s.slug}/` }
  ];
  const docs = s.doctors.map((d) => doctorBySlug[d]).filter(Boolean);
  const related = services.filter((x) => x.slug !== s.slug).slice(0, 3);
  const priceRows = priceGroups.filter((g) => g.service === s.slug).flatMap((g) => g.items).slice(0, 8);

  return page({
    title: s.metaTitle,
    description: s.metaDescription,
    path: `/services/${s.slug}/`,
    active: '/services/',
    ogKey: `service-${s.slug}`,
    crumbs,
    ld: [
      faqLd(s.faq),
      {
        '@context': 'https://schema.org', '@type': 'MedicalProcedure',
        name: s.h1, description: s.lead,
        url: `${clinic.site}/services/${s.slug}/`,
        procedureType: 'https://schema.org/NoninvasiveProcedure',
        howPerformed: s.steps.map((x) => `${x.t}: ${x.d}`).join(' '),
        preparation: s.prep.join('; '),
        followup: s.recovery,
        provider: { '@id': clinic.site + '/#clinic' }
      },
      {
        '@context': 'https://schema.org', '@type': 'Service',
        serviceType: s.title, provider: { '@id': clinic.site + '/#clinic' },
        areaServed: clinic.city,
        offers: { '@type': 'Offer', price: s.priceFrom, priceCurrency: 'RUB', url: `${clinic.site}/services/${s.slug}/` }
      }
    ],
    body: `
<section class="pagehead surface" data-surface="dark">
  <span class="orb orb--a" aria-hidden="true"></span>
  <div class="container">
    <div class="pagehead__grid">
      <div class="stack stack-m">
        ${breadcrumbs(crumbs)}
        <span class="eyebrow">${esc(s.title)}</span>
        <h1 class="h1 balance">${esc(s.h1)}</h1>
        <p class="lead" style="max-width:52ch">${esc(s.lead)}</p>
        <div class="row">
          <span class="chip chip--accent">${icon('wallet', 'ico')}от ${esc(money(s.priceFrom))}</span>
          <span class="chip">${icon('clock', 'ico')}${esc(s.duration)}</span>
          <span class="chip"><i class="pulse-dot" aria-hidden="true"></i>Круглосуточно</span>
        </div>
        <div class="row">
          <a class="btn btn--primary" href="/booking/?service=${attr(s.slug)}" data-magnetic>${icon('calendar')}Записаться на услугу</a>
          <a class="btn btn--glass btn-phone" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}${esc(clinic.phone)}</a>
        </div>
      </div>
      <div class="frame" data-reveal="right" style="aspect-ratio:4/3">
        ${img(s.image, `${s.h1} в клинике LUMEN VET`, { eager: true })}
      </div>
    </div>
  </div>
</section>

<section class="section surface">
  <div class="container two-col">
    <div class="stack stack-l">
      <div class="stack stack-m" data-reveal>
        <h2 class="h2">Что входит в направление</h2>
        <ul class="checklist">${s.items.map((i) => `<li>${icon('checkCircle')}<span>${esc(i)}</span></li>`).join('')}</ul>
      </div>
      <div class="two-col" style="gap:2rem">
        <div class="stack stack-m" data-reveal>
          <h3 class="h3">Кому подходит</h3>
          <ul class="checklist">${s.forWhom.map((i) => `<li>${icon('check')}<span>${esc(i)}</span></li>`).join('')}</ul>
        </div>
        <div class="stack stack-m" data-reveal>
          <h3 class="h3">Когда необходимо</h3>
          <ul class="checklist">${s.when.map((i) => `<li>${icon('alert')}<span>${esc(i)}</span></li>`).join('')}</ul>
        </div>
      </div>
      <div class="stack stack-m" data-reveal>
        <h2 class="h2">Как проходит процедура</h2>
        <ol class="steps" data-stagger>
          ${s.steps.map((st) => `<li class="step"><div><b>${esc(st.t)}</b><p>${esc(st.d)}</p></div></li>`).join('')}
        </ol>
      </div>
      <div class="two-col" style="gap:2rem">
        <div class="stack stack-m" data-reveal>
          <h3 class="h3">Подготовка</h3>
          <ul class="checklist">${s.prep.map((i) => `<li>${icon('check')}<span>${esc(i)}</span></li>`).join('')}</ul>
        </div>
        <div class="stack stack-m" data-reveal>
          <h3 class="h3">Восстановление</h3>
          <p class="soft">${esc(s.recovery)}</p>
          <div class="callout">${icon('info')}<span>Точная тактика определяется врачом после осмотра. Мы согласуем смету до начала лечения.</span></div>
        </div>
      </div>
    </div>

    <aside class="sticky-side stack stack-m" data-reveal="right">
      <div class="card card--solid stack stack-m">
        <h3 class="h4">Стоимость</h3>
        ${priceRows.length ? `<ul class="stack stack-s">${priceRows.map((p) => `<li class="row" style="justify-content:space-between;align-items:baseline;gap:1rem;border-bottom:1px solid var(--line);padding-bottom:.5rem"><span class="small">${esc(p.name)}</span><b class="small num" style="white-space:nowrap">${esc(money(p.price))}${p.unit ? `<i style="font-weight:500;color:var(--fg-mute)"> ${esc(p.unit)}</i>` : ''}</b></li>`).join('')}</ul>`
      : `<p class="small soft">Стоимость от ${esc(money(s.priceFrom))}. Точный расчёт — после осмотра врача.</p>`}
        <p class="tiny muted">Точная стоимость определяется врачом после осмотра и диагностики.</p>
        <a class="btn btn--ghost btn--s btn--block" href="/prices/">Полный прайс-лист</a>
        <a class="btn btn--primary btn--block" href="/booking/?service=${attr(s.slug)}">Записаться на услугу</a>
      </div>
      <div class="card stack stack-s">
        <h3 class="h4">Работаем круглосуточно</h3>
        <p class="small soft">Экстренных пациентов принимаем без записи и вне очереди — в любое время суток.</p>
        <a class="btn btn--danger btn--s btn--block btn-phone" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}${esc(clinic.phone)}</a>
        <p class="tiny muted">${esc(clinic.address)} · ${esc(clinic.metro)}</p>
      </div>
    </aside>
  </div>
</section>

${docs.length ? `<section class="section surface surface--alt" aria-labelledby="sd-t">
  <div class="container">
    <div class="section-head section-head--split">
      <div class="section-head__text" data-reveal>
        <span class="eyebrow">Специалисты направления</span>
        <h2 class="h2" id="sd-t">Врачи, которые ведут <em>${esc(s.title.toLowerCase())}</em></h2>
      </div>
      <a class="link" href="/doctors/">Вся команда ${icon('arrow', 'ico arr')}</a>
    </div>
    <div class="docs" data-stagger>${docs.map(doctorCard).join('')}</div>
  </div>
</section>` : ''}

<section class="section surface" aria-labelledby="sf-t">
  <div class="container two-col">
    <div class="sticky-side stack stack-m" data-reveal="left">
      <span class="eyebrow">Вопросы</span>
      <h2 class="h2" id="sf-t">${esc(s.title)}: <em>частые вопросы</em></h2>
      <p class="lead">Если вашего вопроса нет в списке — задайте его напрямую, мы ответим в течение рабочего дня.</p>
      <div class="row">
        <a class="btn btn--primary btn--s" href="/contacts/#ask">Задать вопрос</a>
        <a class="btn btn--ghost btn--s" href="/faq/">Все вопросы</a>
      </div>
    </div>
    <div data-reveal="right">${faqBlock(s.faq, 'svcfaq')}</div>
  </div>
</section>

<section class="section surface surface--alt" aria-labelledby="rel-t">
  <div class="container">
    <div class="section-head" data-reveal><span class="eyebrow">Смотрите также</span><h2 class="h2" id="rel-t">Другие направления</h2></div>
    <div class="services" data-stagger>${related.map(serviceCard).join('')}</div>
  </div>
</section>
${finaleSection()}`
  });
}

export const servicePaths = services.map((s) => ({ path: `/services/${s.slug}/`, render: () => servicePage(s.slug) }));
export const _unused = plural;
