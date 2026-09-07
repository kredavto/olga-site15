import { clinic } from '../data/clinic.mjs';
import { faq } from '../data/content.mjs';
import { page } from '../lib/layout.mjs';
import { esc, attr, img, splitLines } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import {
  routeCard, emergencySection, uspSection, servicesSection, techSection,
  storiesSection, gallerySection, reviewsSection, promoSection, blogSection,
  faqSection, faqLd, doctorsSection, finaleSection, contactsSection, askForm
} from '../lib/blocks.mjs';

const hero = () => `<section class="hero surface" data-surface="dark">
  <canvas class="hero__particles" id="particles" aria-hidden="true"></canvas>
  <span class="orb orb--a" aria-hidden="true"></span>
  <span class="orb orb--b" aria-hidden="true"></span>
  <span class="noise" aria-hidden="true"></span>
  <div class="container hero__grid">
    <div class="hero__content">
      <div class="hero__badges">
        <span class="badge-247"><i class="pulse-dot" aria-hidden="true"></i>Круглосуточно · 24/7</span>
        <span class="chip chip--danger">Экстренная помощь — круглосуточно</span>
      </div>
      <h1 data-split>${splitLines(['Заботимся о тех,', 'кто для вас', '<em>больше всего</em>'])}</h1>
      <p class="lead hero__lead">Современная ветеринарная помощь 24/7 — диагностика, лечение и экстренная помощь в одной клинике.</p>
      <div class="hero__cta">
        <a class="btn btn--primary" href="/booking/" data-magnetic>${icon('calendar')}Записаться на приём</a>
        <a class="btn btn--danger btn-phone" href="tel:${attr(clinic.phoneHref)}" data-magnetic>${icon('siren')}Получить экстренную помощь</a>
        <a class="btn btn--glass" href="#ask">${icon('chat')}Задать вопрос</a>
      </div>
      <div class="hero__facts">
        <div class="hero__fact"><b class="num"><span data-count="38000" data-suffix="+">38 000+</span></b><span>пациентов с 2014 года</span></div>
        <div class="hero__fact"><b class="num">15 мин</b><span>средняя экстренная сортировка</span></div>
        <div class="hero__fact"><b class="num"><span data-count="4.9">4.9</span></b><span>средняя оценка клиники</span></div>
      </div>
    </div>
    <div class="hero__media">
      <div class="hero__photo" data-reveal="scale">
        ${img('hero-main', 'Врач ветеринарной клиники держит на руках собаку', { eager: true })}
        <span class="hero__photo-tag"><i class="pulse-dot" aria-hidden="true"></i>Врач в клинике сейчас</span>
        <span class="hero__scan" aria-hidden="true"><i></i></span>
      </div>
      ${routeCard()}
    </div>
  </div>
</section>`;

const marquee = () => `<div class="surface surface--alt" style="padding-block:1.15rem;border-block:1px solid var(--line)">
  <div class="marquee"><div class="marquee__track" aria-hidden="true">
    ${Array.from({ length: 2 }, () => [
      'Круглосуточный приём', 'Собственная лаборатория', 'Две операционные', 'Стационар 24/7',
      'УЗИ экспертного класса', 'Приём без записи', 'Смета до лечения', 'Fear Free подход'
    ].map((t) => `<span class="marquee__item">${icon('sparkle', 'ico')}${esc(t)}</span>`).join('')).join('')}
  </div></div>
</div>`;

const aboutTeaser = () => `<section class="section surface surface--alt" aria-labelledby="ab-t">
  <div class="container two-col">
    <div class="stack stack-m" data-reveal="left">
      <span class="eyebrow">О клинике</span>
      <h2 class="h2" id="ab-t">Место, где медицина <em>начинается с заботы</em></h2>
      <p class="lead">С 2014 года мы выросли из одного терапевтического кабинета в клинику полного цикла: собственная лаборатория, две операционные и стационар, который работает без перерывов.</p>
      <p class="soft">Мы верим, что доверие строится на трёх вещах: врач объясняет решение понятными словами, смета известна до начала лечения, а связь с клиникой не обрывается после выхода из кабинета.</p>
      <div class="row">
        <a class="btn btn--ghost" href="/about/">Подробнее о клинике ${icon('arrow', 'ico arr')}</a>
        <a class="link" href="/about/#documents">Лицензии и документы</a>
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr));margin-top:.6rem">
        ${clinic.stats.slice(0, 4).map((s) => `<div class="stack stack-xs"><b class="h3 num" style="color:var(--teal-600)">${esc(s.value)}</b><span class="small muted">${esc(s.label)}</span></div>`).join('')}
      </div>
    </div>
    <div class="frame" data-reveal="right" style="aspect-ratio:4/3.2">${img('about-main', 'Интерьер ветеринарной клиники LUMEN VET')}
      <div class="frame__cap"><b>Зона ожидания с отдельными местами для кошек</b><span class="small" style="color:#C6DAD8">Пресненская наб., 12</span></div>
    </div>
  </div>
</section>`;

const askSection = () => `<section class="section surface" aria-labelledby="ask-t">
  <div class="container two-col">
    <div class="sticky-side stack stack-m" data-reveal="left">
      <span class="eyebrow">Плановое обращение</span>
      <h2 class="h2" id="ask-t">Не уверены, <em>нужен ли визит?</em></h2>
      <p class="lead">Опишите ситуацию — администратор передаст вопрос профильному врачу и подскажет, что делать: приехать сейчас, записаться планово или наблюдать дома.</p>
      <ul class="checklist">
        ${['Ответ в течение рабочего дня', 'Подскажем, к какому специалисту записаться', 'Расскажем, как подготовиться к приёму', 'Экстренные случаи — сразу по телефону'].map((t) => `<li>${icon('checkCircle')}<span>${esc(t)}</span></li>`).join('')}
      </ul>
    </div>
    <div data-reveal="right">${askForm({ compact: true })}</div>
  </div>
</section>`;

export default function homePage() {
  const faqList = faq.slice(0, 8);
  return page({
    title: 'Ветклиника 24/7 в Москве — экстренная помощь | LUMEN VET',
    description: 'Круглосуточная ветеринарная клиника LUMEN VET на Пресненской наб., 12. Экстренная помощь 24/7, терапия, хирургия, УЗИ, лаборатория, стационар. Приём без записи, онлайн-запись и прозрачные цены.',
    path: '/',
    active: '/',
    darkTop: true,
    ogKey: 'default',
    crumbs: [{ label: 'Главная', href: '/' }],
    ld: [faqLd(faqList), {
      '@context': 'https://schema.org', '@type': 'WebSite',
      name: clinic.name, url: clinic.site + '/',
      potentialAction: { '@type': 'SearchAction', target: `${clinic.site}/prices/?q={search_term_string}`, 'query-input': 'required name=search_term_string' }
    }],
    body: [
      hero(), marquee(), emergencySection(), uspSection(), servicesSection(6),
      techSection(), storiesSection(), doctorsSection(3), aboutTeaser(),
      gallerySection(), reviewsSection(6), promoSection(3), blogSection(3),
      faqSection(faqList), askSection(), contactsSection(), finaleSection()
    ].join('\n')
  });
}
