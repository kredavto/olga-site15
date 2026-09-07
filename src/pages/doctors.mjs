import { clinic } from '../data/clinic.mjs';
import { doctors, doctorBySlug } from '../data/doctors.mjs';
import { serviceBySlug } from '../data/services.mjs';
import { reviews } from '../data/content.mjs';
import { page, breadcrumbs } from '../lib/layout.mjs';
import { esc, attr, img, plural, dateRu, seoTitle } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { doctorCard, finaleSection, serviceCard } from '../lib/blocks.mjs';

const nextDates = (seed) => {
  const out = [];
  const base = new Date('2026-09-08T00:00:00Z');
  const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  for (let i = 0; i < 5; i++) {
    const d = new Date(base.getTime() + (i * 2 + (seed % 2)) * 86400000);
    out.push({ d: d.getUTCDate(), w: days[d.getUTCDay()], iso: d.toISOString().slice(0, 10) });
  }
  return out;
};

export function doctorsIndex() {
  const crumbs = [{ label: 'Главная', href: '/' }, { label: 'Врачи', href: '/doctors/' }];
  return page({
    title: 'Ветеринарные врачи клиники LUMEN VET — команда специалистов в Москве',
    description: 'Терапевты, хирурги, кардиолог, дерматолог, стоматолог и специалист по УЗИ. Образование, опыт, сертификаты и запись к конкретному врачу.',
    path: '/doctors/', active: '/doctors/', ogKey: 'doctors', crumbs,
    ld: [{
      '@context': 'https://schema.org', '@type': 'ItemList',
      itemListElement: doctors.map((d, i) => ({ '@type': 'ListItem', position: i + 1, name: d.name, url: `${clinic.site}/doctors/${d.slug}/` }))
    }],
    body: `
<section class="pagehead surface" data-surface="dark">
  <span class="orb orb--c" aria-hidden="true"></span>
  <div class="container stack stack-m">
    ${breadcrumbs(crumbs)}
    <span class="eyebrow">Команда</span>
    <h1 class="h1 balance" style="max-width:18ch">Люди, которым вы доверяете <em>самое дорогое</em></h1>
    <p class="lead" style="max-width:56ch">Девять специализаций, регулярные разборы сложных случаев и врач, который остаётся с вами на связи после визита.</p>
    <div class="row">
      <a class="btn btn--primary" href="/booking/">${icon('calendar')}Записаться к врачу</a>
      <a class="btn btn--glass btn-phone" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}${esc(clinic.phone)}</a>
    </div>
  </div>
</section>
<section class="section surface">
  <div class="container">
    <div class="docs" data-stagger>${doctors.map(doctorCard).join('')}</div>
  </div>
</section>
${finaleSection()}`
  });
}

export function doctorPage(slug) {
  const d = doctorBySlug[slug];
  const crumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Врачи', href: '/doctors/' },
    { label: d.name, href: `/doctors/${d.slug}/` }
  ];
  const svcs = d.services.map((s) => serviceBySlug[s]).filter(Boolean);
  const revs = reviews.slice(doctors.indexOf(d) % 4, (doctors.indexOf(d) % 4) + 2);
  const dates = nextDates(d.exp);

  return page({
    title: seoTitle(`${d.name} — ${d.role}`, 'Ветклиника LUMEN VET'),
    description: `${d.name}: ${d.spec}. Опыт ${plural(d.exp, 'год', 'года', 'лет')}, образование, сертификаты и направления работы. Запись на приём онлайн или по телефону ${clinic.phone}.`,
    path: `/doctors/${d.slug}/`, active: '/doctors/', ogKey: `doctor-${d.slug}`, crumbs,
    ld: [{
      '@context': 'https://schema.org', '@type': 'Physician',
      name: d.name, jobTitle: d.role, url: `${clinic.site}/doctors/${d.slug}/`,
      image: `${clinic.site}/assets/img/${d.image}.svg`,
      medicalSpecialty: d.spec,
      worksFor: { '@id': clinic.site + '/#clinic' },
      alumniOf: d.education.map((e) => ({ '@type': 'EducationalOrganization', name: e.split(',')[0] })),
      knowsAbout: d.focus
    }],
    body: `
<section class="pagehead surface">
  <div class="container">${breadcrumbs(crumbs)}</div>
</section>
<section class="section surface" style="padding-top:1rem">
  <div class="container dochero">
    <div data-reveal="left">
      <div class="dochero__photo">${img(d.image, `${d.name} — ${d.role}`, { eager: true })}</div>
    </div>
    <div class="stack stack-l">
      <div class="stack stack-m" data-reveal>
        <span class="eyebrow">${esc(d.role)}</span>
        <h1 class="h1">${esc(d.name)}</h1>
        <p class="lead">${esc(d.spec)}</p>
        <div class="row">
          <span class="chip chip--accent">${icon('award', 'ico')}${esc(plural(d.exp, 'год', 'года', 'лет'))} опыта</span>
          <span class="chip">В клинике с ${esc(String(d.since))}</span>
        </div>
        <div class="row">
          <a class="btn btn--primary" href="/booking/?doctor=${attr(d.slug)}" data-magnetic>${icon('calendar')}Записаться к врачу</a>
          <a class="btn btn--ghost btn-phone" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}${esc(clinic.phone)}</a>
        </div>
      </div>

      <div class="quote" data-reveal>${esc(d.quote)}</div>

      <div class="stack stack-m" data-reveal>
        <h2 class="h3">О враче</h2>
        ${d.bio.map((p) => `<p class="soft">${esc(p)}</p>`).join('')}
      </div>

      <dl class="deflist" data-reveal>
        <div><dt>Образование</dt><dd><ul class="checklist">${d.education.map((e) => `<li>${icon('doc')}<span>${esc(e)}</span></li>`).join('')}</ul></dd></div>
        <div><dt>Сертификаты</dt><dd><ul class="checklist">${d.certs.map((e) => `<li>${icon('award')}<span>${esc(e)}</span></li>`).join('')}</ul></dd></div>
        <div><dt>Направления работы</dt><dd><ul class="tag-row">${d.focus.map((f) => `<li class="chip chip--accent">${esc(f)}</li>`).join('')}</ul></dd></div>
        <div><dt>Ведёт приём</dt><dd><ul class="tag-row">${svcs.map((s) => `<li><a class="chip" href="/services/${attr(s.slug)}/">${esc(s.title)}</a></li>`).join('')}</ul></dd></div>
      </dl>

      <div class="card card--solid stack stack-m" data-reveal>
        <div class="row" style="justify-content:space-between">
          <h2 class="h4">Ближайшие доступные даты</h2>
          <span class="tiny muted">Уточняются администратором</span>
        </div>
        <div class="dates">
          ${dates.map((x, i) => `<label class="choice"><input type="radio" name="docdate" value="${attr(x.iso)}"${i === 0 ? ' checked' : ''}><span><b>${x.d}</b><small>${esc(x.w)}</small></span></label>`).join('')}
        </div>
        <a class="btn btn--primary btn--block" href="/booking/?doctor=${attr(d.slug)}">Записаться к врачу</a>
      </div>
    </div>
  </div>
</section>

<section class="section surface surface--alt" aria-labelledby="dr-t">
  <div class="container">
    <div class="section-head" data-reveal><span class="eyebrow">Отзывы</span><h2 class="h2" id="dr-t">Что пишут пациенты</h2></div>
    <div class="reviews" data-stagger>
      ${revs.map((r) => `<article class="review">
        <div class="review__head">${img(r.image, `Питомец: ${r.pet}`, { class: 'review__ava' })}<div class="review__who"><b>${esc(r.name)}</b><span>${esc(r.pet)}</span></div></div>
        <p class="review__text">${esc(r.text)}</p>
        <div class="review__foot"><span class="review__stars" aria-label="Оценка ${r.rate} из 5">${Array.from({ length: r.rate }, () => icon('star', 'ico')).join('')}</span><time datetime="${attr(r.date)}">${esc(dateRu(r.date))}</time></div>
      </article>`).join('')}
    </div>
    <div class="row" style="margin-top:1.5rem"><a class="btn btn--ghost" href="/reviews/">Все отзывы о клинике ${icon('arrow', 'ico arr')}</a></div>
  </div>
</section>

<section class="section surface" aria-labelledby="ds-t">
  <div class="container">
    <div class="section-head" data-reveal><span class="eyebrow">Направления</span><h2 class="h2" id="ds-t">Услуги, которые ведёт врач</h2></div>
    <div class="services" data-stagger>${svcs.map(serviceCard).join('')}</div>
  </div>
</section>
${finaleSection()}`
  });
}
