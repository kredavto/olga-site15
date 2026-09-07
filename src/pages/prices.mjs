import { clinic } from '../data/clinic.mjs';
import { priceGroups, calculator } from '../data/prices.mjs';
import { page, breadcrumbs } from '../lib/layout.mjs';
import { esc, attr, money } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { finaleSection, faqBlock, faqLd } from '../lib/blocks.mjs';

const popular = priceGroups.flatMap((g) => g.items.filter((i) => i.popular).map((i) => ({ ...i, group: g })));

const priceFaq = [
  { q: 'Почему цена указана «от»?', a: 'Итоговая стоимость зависит от вида и веса животного, объёма процедуры, расходных материалов и наркоза. Врач согласовывает смету до начала лечения, и мы не меняем её без вашего согласия.' },
  { q: 'Что входит в стоимость приёма?', a: 'Консультация врача, клинический осмотр, термометрия и письменный протокол с назначениями. Анализы, УЗИ и процедуры оплачиваются отдельно.' },
  { q: 'Есть ли доплата за ночное время?', a: 'Да, приём с 23:00 до 08:00 стоит дороже дневного — 3 600 ₽ вместо 2 400 ₽. Стоимость экстренных манипуляций при этом не меняется.' },
  { q: 'Можно ли оплатить лечение частями?', a: 'Для плановых процедур стоимостью от 30 000 ₽ доступна оплата частями. Условия уточняйте у администратора.' }
];

export default function pricesPage() {
  const crumbs = [{ label: 'Главная', href: '/' }, { label: 'Цены', href: '/prices/' }];
  return page({
    title: 'Цены ветеринарной клиники в Москве — прайс-лист LUMEN VET',
    description: 'Прозрачный прайс-лист: приём, диагностика, анализы, вакцинация, хирургия, стоматология, груминг и стационар. Поиск по услугам и калькулятор ориентировочной стоимости.',
    path: '/prices/', active: '/prices/', ogKey: 'prices', crumbs,
    ld: [faqLd(priceFaq), {
      '@context': 'https://schema.org', '@type': 'OfferCatalog',
      name: 'Прайс-лист LUMEN VET',
      itemListElement: priceGroups.map((g) => ({
        '@type': 'OfferCatalog', name: g.title,
        itemListElement: g.items.map((i) => ({
          '@type': 'Offer', name: i.name, price: i.price, priceCurrency: 'RUB',
          availability: 'https://schema.org/InStock'
        }))
      }))
    }],
    body: `
<section class="pagehead surface" data-surface="dark">
  <span class="orb orb--a" aria-hidden="true"></span>
  <div class="container stack stack-m">
    ${breadcrumbs(crumbs)}
    <span class="eyebrow">Цены</span>
    <h1 class="h1 balance" style="max-width:18ch">Прозрачные цены <em>без неожиданных расходов</em></h1>
    <p class="lead" style="max-width:58ch">Смета согласовывается до начала лечения. Если в процессе что-то меняется, врач сначала звонит вам — и только потом продолжает.</p>
    <div class="row">
      <a class="btn btn--primary" href="#calc-block">${icon('wallet')}Рассчитать стоимость</a>
      <a class="btn btn--glass btn-phone" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}${esc(clinic.phone)}</a>
    </div>
  </div>
</section>

<section class="section surface" aria-labelledby="pop-t">
  <div class="container">
    <div class="section-head" data-reveal><span class="eyebrow">Популярное</span><h2 class="h2" id="pop-t">Самые частые услуги</h2></div>
    <div class="popular-cards" data-stagger>
      ${popular.map((p) => `<article class="pcard">
        <span class="chip chip--accent" style="align-self:flex-start;font-size:.72rem">${esc(p.group.title)}</span>
        <b>${esc(p.name)}</b>
        ${p.note ? `<span>${esc(p.note)}</span>` : ''}
        <span class="val num">от ${esc(money(p.price))}</span>
      </article>`).join('')}
    </div>

    <div class="section-head section-head--split" style="margin-top:2rem">
      <div class="section-head__text" data-reveal>
        <h2 class="h2" id="pl-t">Полный прайс-лист</h2>
        <p class="soft">Найдите услугу по названию или выберите категорию.</p>
      </div>
    </div>

    <div class="price-tools">
      <div class="search">
        ${icon('search')}
        <input class="input" id="price-search" type="search" placeholder="Поиск услуги: УЗИ, вакцинация, стерилизация…" aria-label="Поиск по прайс-листу">
      </div>
    </div>
    <div class="filters" data-filter-group="prices">
      <button class="filter" type="button" data-value="all" aria-pressed="true">Все категории</button>
      ${priceGroups.map((g) => `<button class="filter" type="button" data-value="${attr(g.id)}" aria-pressed="false">${esc(g.title)}</button>`).join('')}
    </div>

    <div class="pricetable" aria-labelledby="pl-t">
      ${priceGroups.map((g) => `<div class="pricegroup" data-cat="${attr(g.id)}" data-title="${attr(g.title)}">
        <div class="pricegroup__head"><h3>${esc(g.title)}</h3><a class="link" href="/services/${attr(g.service)}/">Подробнее ${icon('arrow', 'ico arr')}</a></div>
        ${g.items.map((i) => `<div class="pricerow" data-name="${attr(i.name)}">
          <div class="pricerow__name"><b>${esc(i.name)}</b>${i.note ? `<span>${esc(i.note)}</span>` : ''}</div>
          <div class="pricerow__val num">от ${esc(money(i.price))}${i.unit ? `<i> ${esc(i.unit)}</i>` : ''}</div>
        </div>`).join('')}
      </div>`).join('')}
      <p class="price-empty" id="price-empty">Ничего не найдено. Попробуйте изменить запрос или <a class="link" href="tel:${attr(clinic.phoneHref)}">позвоните нам</a>.</p>
    </div>
    <p class="tiny muted" style="margin-top:1rem">Цены указаны в рублях и носят справочный характер. Точная стоимость определяется врачом после осмотра и диагностики.</p>
  </div>
</section>

<section class="section surface surface--alt" id="calc-block" aria-labelledby="calc-t">
  <div class="container">
    <div class="section-head" data-reveal>
      <span class="eyebrow">Калькулятор</span>
      <h2 class="h2" id="calc-t">Рассчитать <em>ориентировочную стоимость</em></h2>
      <p class="lead">Выберите параметры — калькулятор покажет диапазон, в который обычно укладывается такой визит.</p>
    </div>
    <div class="calc">
      <form class="form-card stack stack-l" id="calc" novalidate>
        <div class="stack stack-s">
          <label class="h4" for="calc-species-0">1. Вид животного</label>
          <div class="choices">
            ${calculator.species.map((s, i) => `<label class="choice choice--tile"><input type="radio" id="calc-species-${i}" name="species" value="${attr(s.id)}" data-k="${s.k}"${i === 0 ? ' checked' : ''}><span>${esc(s.label)}${s.note ? `<small>${esc(s.note)}</small>` : ''}</span></label>`).join('')}
          </div>
        </div>
        <div class="stack stack-s">
          <span class="h4">2. Вес питомца</span>
          <div class="choices">
            ${calculator.weights.map((w, i) => `<label class="choice"><input type="radio" name="weight" value="${attr(w.id)}" data-k="${w.k}"${i === 1 ? ' checked' : ''}><span>${esc(w.label)}</span></label>`).join('')}
          </div>
        </div>
        <div class="field">
          <label class="h4" for="calc-service">3. Услуга</label>
          <select class="select" id="calc-service" name="service">
            ${calculator.services.map((s) => `<option value="${attr(s.id)}" data-base="${s.base}">${esc(s.label)}</option>`).join('')}
          </select>
        </div>
        <div class="stack stack-s">
          <span class="h4">4. Дополнительные процедуры</span>
          <div class="choices">
            ${calculator.extras.map((e) => `<label class="choice"><input type="checkbox" name="extra" value="${attr(e.id)}" data-label="${attr(e.label)}"${e.add ? ` data-add="${e.add}"` : ''}${e.mult ? ` data-mult="${e.mult}"` : ''}><span>${esc(e.label)}</span></label>`).join('')}
          </div>
        </div>
      </form>
      <aside class="calc__out">
        <span class="tiny" style="letter-spacing:.16em;text-transform:uppercase;color:#8FD8CB;font-weight:700">Ориентировочная стоимость</span>
        <div class="calc__sum" id="calc-sum">—</div>
        <div class="calc__list" id="calc-list"></div>
        <p class="calc__disclaimer">Точная стоимость определяется врачом после осмотра и диагностики. Расчёт носит справочный характер и не является публичной офертой.</p>
        <a class="btn btn--primary btn--block" href="/booking/">Записаться на приём</a>
      </aside>
    </div>
  </div>
</section>

<section class="section surface" aria-labelledby="pf-t">
  <div class="container two-col">
    <div class="sticky-side stack stack-m" data-reveal="left">
      <span class="eyebrow">О ценах</span>
      <h2 class="h2" id="pf-t">Как формируется <em>итоговая стоимость</em></h2>
      <p class="lead">Мы называем цену до начала лечения и не увеличиваем её без вашего согласия.</p>
      <a class="btn btn--primary btn--s" href="/contacts/#ask">Задать вопрос о стоимости</a>
    </div>
    <div data-reveal="right">${faqBlock(priceFaq, 'pricefaq')}</div>
  </div>
</section>
${finaleSection()}`
  });
}
