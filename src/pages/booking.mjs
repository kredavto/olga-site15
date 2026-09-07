import { clinic } from '../data/clinic.mjs';
import { services } from '../data/services.mjs';
import { doctors } from '../data/doctors.mjs';
import { page, breadcrumbs } from '../lib/layout.mjs';
import { esc, attr, img } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { finaleSection } from '../lib/blocks.mjs';

const dates = () => {
  const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const base = new Date('2026-09-08T00:00:00Z');
  return Array.from({ length: 8 }, (_, i) => {
    const d = new Date(base.getTime() + i * 86400000);
    return { iso: d.toISOString().slice(0, 10), day: d.getUTCDate(), w: days[d.getUTCDay()], m: months[d.getUTCMonth()] };
  });
};

const times = ['09:00', '10:30', '11:15', '12:45', '14:00', '15:30', '16:15', '17:45', '19:00', '20:30', '22:00', '23:30'];

export default function bookingPage() {
  const crumbs = [{ label: 'Главная', href: '/' }, { label: 'Онлайн-запись', href: '/booking/' }];
  const ds = dates();
  return page({
    title: 'Онлайн-запись к ветеринару в Москве — LUMEN VET',
    description: 'Запишитесь на приём к ветеринарному врачу за минуту: выберите животное, направление, врача, дату и время. Круглосуточная клиника на Пресненской наб., 12.',
    path: '/booking/', active: '/booking/', ogKey: 'booking', crumbs,
    ld: [{
      '@context': 'https://schema.org', '@type': 'ReserveAction',
      name: 'Онлайн-запись на приём',
      target: { '@type': 'EntryPoint', urlTemplate: `${clinic.site}/booking/`, actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'] },
      provider: { '@id': clinic.site + '/#clinic' }
    }],
    body: `
<section class="pagehead surface" data-surface="dark">
  <span class="orb orb--a" aria-hidden="true"></span><span class="orb orb--b" aria-hidden="true"></span>
  <div class="container stack stack-m">
    ${breadcrumbs(crumbs)}
    <span class="eyebrow">Онлайн-запись</span>
    <h1 class="h1 balance" style="max-width:18ch">Запишитесь на приём <em>за одну минуту</em></h1>
    <p class="lead" style="max-width:56ch">Шесть коротких шагов. Если ситуация экстренная — не заполняйте форму, просто позвоните: мы принимаем без записи круглосуточно.</p>
    <div class="row">
      <a class="btn btn--danger btn-phone" href="tel:${attr(clinic.phoneHref)}">${icon('siren')}Экстренная помощь: ${esc(clinic.phone)}</a>
    </div>
  </div>
</section>

<section class="section surface">
  <div class="container two-col">
    <div class="form-card wizard" id="booking">
      <form data-form="booking" novalidate>
        <div class="form-body">
          <div class="wizard__bar" aria-hidden="true"><i></i></div>
          <div class="wizard__steps" role="list">
            ${['Питомец', 'Направление', 'Врач', 'Дата', 'Время', 'Контакты'].map((t, i) => `<span class="wizard__dot${i === 0 ? ' is-active' : ''}" role="listitem"><i>${i + 1}</i>${esc(t)}</span>`).join('')}
          </div>

          <fieldset class="wizard__panel is-active" data-required="species">
            <legend class="h3">Шаг 1. Выберите животное</legend>
            <p class="small muted">Это помогает подобрать врача и подготовить кабинет.</p>
            <div class="choices">
              ${[['dog', 'Собака', 'Все породы и размеры'], ['cat', 'Кошка', 'Отдельная тихая зона'], ['other', 'Другое', 'Кролики, грызуны, хорьки, птицы']]
      .map(([v, l, s]) => `<label class="choice choice--tile"><input type="radio" name="species" value="${attr(v)}" data-label="${attr(l)}"><span>${esc(l)}<small>${esc(s)}</small></span></label>`).join('')}
            </div>
          </fieldset>

          <fieldset class="wizard__panel" data-required="direction">
            <legend class="h3">Шаг 2. Выберите направление</legend>
            <p class="small muted">Не уверены? Выберите «Терапия» — врач направит к нужному специалисту.</p>
            <div class="choices">
              ${services.map((s) => `<label class="choice"><input type="radio" name="direction" value="${attr(s.slug)}" data-label="${attr(s.title)}"><span>${esc(s.title)}</span></label>`).join('')}
            </div>
          </fieldset>

          <fieldset class="wizard__panel" data-required="doctor">
            <legend class="h3">Шаг 3. Выберите врача</legend>
            <p class="small muted">Или доверьте выбор администратору — подберём специалиста по вашей ситуации.</p>
            <div class="docpick">
              <label class="choice"><input type="radio" name="doctor" value="any" data-label="Любой свободный врач" checked><span>${img('doc-orlova', 'Любой свободный врач')}<div><b>Любой свободный</b><small>Ближайшее свободное время</small></div></span></label>
              ${doctors.map((d) => `<label class="choice"><input type="radio" name="doctor" value="${attr(d.slug)}" data-label="${attr(d.name)}"><span>${img(d.image, d.name)}<div><b>${esc(d.name)}</b><small>${esc(d.role)}</small></div></span></label>`).join('')}
            </div>
          </fieldset>

          <fieldset class="wizard__panel" data-required="date">
            <legend class="h3">Шаг 4. Выберите дату</legend>
            <p class="small muted">Клиника работает круглосуточно, включая выходные.</p>
            <div class="dates">
              ${ds.map((d, i) => `<label class="choice"><input type="radio" name="date" value="${attr(d.iso)}" data-label="${attr(`${d.day} ${d.m}, ${d.w}`)}"${i === 0 ? ' checked' : ''}><span><b>${d.day}</b><small>${esc(d.m)} · ${esc(d.w)}</small></span></label>`).join('')}
            </div>
          </fieldset>

          <fieldset class="wizard__panel" data-required="time">
            <legend class="h3">Шаг 5. Выберите время</legend>
            <p class="small muted">Ночной приём (23:00–08:00) тарифицируется отдельно.</p>
            <div class="slots">
              ${times.map((t, i) => `<label class="choice"><input type="radio" name="time" value="${attr(t)}" data-label="${attr(t)}"${i === 2 ? ' checked' : ''} data-autonext="false"><span>${esc(t)}</span></label>`).join('')}
            </div>
          </fieldset>

          <fieldset class="wizard__panel">
            <legend class="h3">Шаг 6. Контактные данные</legend>
            <dl class="wizard__summary" id="wz-summary"></dl>
            <div class="form-grid">
              <div class="field"><label for="bk-name">Ваше имя <span class="req">*</span></label><input class="input" id="bk-name" name="name" required autocomplete="name" placeholder="Как к вам обращаться"><span class="field__err">Укажите имя</span></div>
              <div class="field"><label for="bk-tel">Телефон <span class="req">*</span></label><input class="input" id="bk-tel" name="phone" type="tel" required autocomplete="tel" placeholder="+7 (___) ___-__-__"><span class="field__err">Укажите корректный телефон</span></div>
              <div class="field"><label for="bk-pet">Имя питомца</label><input class="input" id="bk-pet" name="pet" placeholder="Например, Барни"></div>
              <div class="field"><label for="bk-age">Возраст питомца</label><input class="input" id="bk-age" name="age" placeholder="Например, 3 года"></div>
              <div class="field full"><label for="bk-comment">Что беспокоит</label><textarea class="textarea" id="bk-comment" name="comment" placeholder="Кратко опишите симптомы или цель визита"></textarea></div>
              <div class="full"><label class="checkbox"><input type="checkbox" required><span>Согласен на обработку персональных данных в соответствии с <a href="/privacy/">политикой конфиденциальности</a></span></label></div>
            </div>
          </fieldset>

          <div class="wizard__foot">
            <button class="btn btn--ghost btn--s" type="button" data-wz-back hidden>${icon('arrowLeft')}Назад</button>
            <button class="btn btn--primary" type="button" data-wz-next data-magnetic>Далее ${icon('arrow', 'ico arr')}</button>
            <button class="btn btn--primary" type="submit" data-wz-submit hidden data-magnetic>Подтвердить запись</button>
          </div>
        </div>
        <div class="form-success">
          <span class="tick">${icon('check')}</span>
          <h2 class="h3">Заявка принята</h2>
          <p class="soft" style="max-width:44ch">Администратор перезвонит, чтобы подтвердить время. Если ситуация изменится и станет экстренной — звоните сразу: <a class="link" href="tel:${attr(clinic.phoneHref)}">${esc(clinic.phone)}</a></p>
          <a class="btn btn--ghost btn--s" href="/">На главную</a>
        </div>
      </form>
    </div>

    <aside class="sticky-side stack stack-m">
      <div class="card stack stack-s">
        <h2 class="h4">Приезжаете без записи?</h2>
        <p class="small soft">Это возможно в любое время суток. Экстренные пациенты принимаются вне очереди, при плановом визите без записи возможно ожидание.</p>
        <a class="btn btn--danger btn--s btn--block btn-phone" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}${esc(clinic.phone)}</a>
      </div>
      <div class="card stack stack-s">
        <h2 class="h4">Как нас найти</h2>
        <p class="small soft">${esc(clinic.address)}</p>
        <p class="small muted">${esc(clinic.metro)}<br>${esc(clinic.parking)}</p>
        <a class="btn btn--ghost btn--s btn--block" href="${attr(clinic.routes.yandex)}" target="_blank" rel="noopener">${icon('route')}Построить маршрут</a>
      </div>
      <div class="card stack stack-s">
        <h2 class="h4">Что взять с собой</h2>
        <ul class="checklist">
          ${['Ветеринарный паспорт', 'Предыдущие анализы и выписки', 'Упаковку текущего корма при проблемах с ЖКТ', 'Переноску для кошек и мелких собак'].map((t) => `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('')}
        </ul>
      </div>
    </aside>
  </div>
</section>
${finaleSection()}`
  });
}
