import { clinic } from '../data/clinic.mjs';
import { faq, principles, timeline, documents, gallery } from '../data/content.mjs';
import { page, breadcrumbs } from '../lib/layout.mjs';
import { esc, attr, img } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import {
  finaleSection, faqBlock, faqLd, contactsSection, askForm, emergencySection,
  doctorsSection, reviewsSection, promoSection, gallerySection, techSection
} from '../lib/blocks.mjs';

/* ---------------- О клинике ---------------- */
export function aboutPage() {
  const crumbs = [{ label: 'Главная', href: '/' }, { label: 'О клинике', href: '/about/' }];
  return page({
    title: 'О ветеринарной клинике LUMEN VET — история, принципы, лицензии',
    description: 'Круглосуточная клиника в Москве с 2014 года: своя лаборатория, две операционные, стационар на 18 боксов. Принципы работы, команда, лицензии и документы.',
    path: '/about/', active: '/about/', ogKey: 'about', crumbs,
    body: `
<section class="pagehead surface" data-surface="dark">
  <span class="orb orb--a" aria-hidden="true"></span><span class="orb orb--b" aria-hidden="true"></span>
  <div class="container">
    <div class="pagehead__grid">
      <div class="stack stack-m">
        ${breadcrumbs(crumbs)}
        <span class="eyebrow">О клинике</span>
        <h1 class="h1 balance">Место, где медицина <em>начинается с заботы</em></h1>
        <p class="lead" style="max-width:52ch">С 2014 года мы выросли из одного кабинета в клинику полного цикла — но принцип остался прежним: сначала объяснить, потом лечить.</p>
      </div>
      <div class="frame" style="aspect-ratio:4/3">${img('about-main', 'Интерьер ветеринарной клиники LUMEN VET', { eager: true })}</div>
    </div>
  </div>
</section>

<section class="section surface">
  <div class="container two-col">
    <div class="stack stack-m" data-reveal="left">
      <h2 class="h2">Как мы работаем</h2>
      <p class="lead">Мы построили клинику, в которую сами бы привезли своего питомца ночью.</p>
      <p class="soft">Это значит: врач в клинике круглосуточно, диагностика выполняется на месте, а не «привезите анализы через два дня», и решение принимается по результатам исследований, а не по внешнему виду пациента.</p>
      <p class="soft">Мы сознательно не ставим приёмы «встык»: у врача есть время подробно расспросить владельца. Большая часть диагнозов начинается именно с разговора.</p>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));margin-top:.6rem">
        ${clinic.stats.map((s) => `<div class="stack stack-xs"><b class="h3 num" style="color:var(--teal-600)">${esc(s.value)}</b><span class="small"><b>${esc(s.label)}</b></span><span class="tiny muted">${esc(s.note)}</span></div>`).join('')}
      </div>
    </div>
    <div class="stack stack-m" data-reveal="right">
      <div class="frame" style="aspect-ratio:4/3.4">${img('about-team', 'Команда ветеринарной клиники')}
        <div class="frame__cap"><b>Команда LUMEN VET</b><span class="small" style="color:#C6DAD8">26 специалистов, 9 направлений</span></div>
      </div>
      <div class="quote">Мы не обещаем невозможного и не назначаем лечение ради лечения. Честный прогноз — часть заботы.</div>
    </div>
  </div>
</section>

<section class="section surface surface--alt" aria-labelledby="pr-t">
  <div class="container">
    <div class="section-head" data-reveal><span class="eyebrow">Принципы</span><h2 class="h2" id="pr-t">Шесть правил, <em>которые мы не нарушаем</em></h2></div>
    <div class="principles" data-stagger>
      ${principles.map((p) => `<article class="principle"><b>${esc(p.n)}</b><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p></article>`).join('')}
    </div>
  </div>
</section>

<section class="section surface" aria-labelledby="tl-t">
  <div class="container two-col">
    <div class="sticky-side stack stack-m" data-reveal="left">
      <span class="eyebrow">История</span>
      <h2 class="h2" id="tl-t">Как клиника <em>стала такой</em></h2>
      <p class="lead">Каждый этап — это ответ на конкретную проблему, с которой сталкивались наши пациенты.</p>
    </div>
    <div class="timeline" data-reveal="right">
      ${timeline.map((t) => `<div class="timeline__item"><div class="timeline__y">${esc(t.y)}</div><h3>${esc(t.t)}</h3><p>${esc(t.d)}</p></div>`).join('')}
    </div>
  </div>
</section>

${techSection()}
${doctorsSection(6)}
${gallerySection()}

<section class="section surface" id="documents" aria-labelledby="dc-t">
  <div class="container stack stack-l">
    <div class="section-head" data-reveal><span class="eyebrow">Документы</span><h2 class="h2" id="dc-t">Лицензии и документы</h2><p class="lead">Копии документов предоставляются по запросу на ресепшене клиники.</p></div>
    <div class="doclist" data-stagger>
      ${documents.map((d) => `<div class="doc">${icon('doc')}<div><b>${esc(d.title)}</b><span>${esc(d.num)} · ${esc(d.date)}</span></div></div>`).join('')}
    </div>
    <p class="tiny muted">Реквизиты приведены в демонстрационном виде и подлежат замене на действующие данные организации.</p>
  </div>
</section>
${finaleSection()}`
  });
}

/* ---------------- Контакты ---------------- */
export function contactsPage() {
  const crumbs = [{ label: 'Главная', href: '/' }, { label: 'Контакты', href: '/contacts/' }];
  return page({
    title: 'Контакты ветклиники в Москве — адрес и маршрут | LUMEN VET',
    description: `Круглосуточная ветклиника: ${clinic.address}. Телефон ${clinic.phone}, метро Выставочная, подземный паркинг. Постройте маршрут в один клик.`,
    path: '/contacts/', active: '/contacts/', ogKey: 'contacts', crumbs,
    body: `
<section class="pagehead surface" data-surface="dark">
  <span class="orb orb--a" aria-hidden="true"></span>
  <div class="container stack stack-m">
    ${breadcrumbs(crumbs)}
    <span class="eyebrow">Контакты</span>
    <h1 class="h1 balance" style="max-width:18ch">Мы рядом, когда это <em>действительно важно</em></h1>
    <div class="row">
      <a class="btn btn--danger btn-phone" href="tel:${attr(clinic.phoneHref)}" data-magnetic>${icon('phone')}${esc(clinic.phone)}</a>
      <a class="btn btn--glass" href="${attr(clinic.routes.yandex)}" target="_blank" rel="noopener">${icon('route')}Построить маршрут</a>
      <a class="btn btn--primary" href="/booking/">${icon('calendar')}Записаться на приём</a>
    </div>
  </div>
</section>
${contactsSection()}
${emergencySection()}
<section class="section surface surface--alt">
  <div class="container two-col">
    <div class="sticky-side stack stack-m" data-reveal="left">
      <span class="eyebrow">Плановое обращение</span>
      <h2 class="h2">Есть вопрос <em>о здоровье питомца?</em></h2>
      <p class="lead">Опишите ситуацию — администратор передаст вопрос профильному врачу и подскажет, что делать дальше.</p>
      <ul class="checklist">
        ${['Ответ в течение рабочего дня', 'Подскажем нужного специалиста', 'Расскажем, как подготовиться к приёму', 'Экстренные случаи — сразу по телефону'].map((t) => `<li>${icon('checkCircle')}<span>${esc(t)}</span></li>`).join('')}
      </ul>
    </div>
    <div data-reveal="right">${askForm()}</div>
  </div>
</section>
${finaleSection()}`
  });
}

/* ---------------- Отзывы ---------------- */
export function reviewsPage() {
  const crumbs = [{ label: 'Главная', href: '/' }, { label: 'Отзывы', href: '/reviews/' }];
  return page({
    title: 'Отзывы о ветеринарной клинике LUMEN VET в Москве',
    description: 'Реальные отзывы владельцев животных о приёме, экстренной помощи, хирургии и стационаре. Средняя оценка 4.9 из 5 по 412 отзывам.',
    path: '/reviews/', active: '/reviews/', ogKey: 'reviews', crumbs,
    body: `
<section class="pagehead surface" data-surface="dark">
  <span class="orb orb--c" aria-hidden="true"></span>
  <div class="container stack stack-m">
    ${breadcrumbs(crumbs)}
    <span class="eyebrow">Отзывы</span>
    <h1 class="h1 balance" style="max-width:16ch">Нам доверяют <em>самое дорогое</em></h1>
    <p class="lead" style="max-width:54ch">Мы публикуем отзывы как есть — включая замечания. Это честнее и полезнее, чем подборка рекламных цитат.</p>
  </div>
</section>
${reviewsSection()}
<section class="section surface" id="leave">
  <div class="container two-col">
    <div class="sticky-side stack stack-m" data-reveal="left">
      <span class="eyebrow">Обратная связь</span>
      <h2 class="h2">Оставить отзыв</h2>
      <p class="lead">Ваш отзыв помогает другим владельцам принять решение, а нам — стать лучше. Мы читаем все сообщения, включая критику.</p>
      <p class="soft">Отзывы также можно оставить на внешних площадках — ссылки появятся здесь после подключения профилей клиники.</p>
      <div class="row">
        <a class="btn btn--ghost btn--s" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}Позвонить</a>
        <a class="btn btn--ghost btn--s" href="mailto:${attr(clinic.email)}">${icon('mail')}Написать письмо</a>
      </div>
    </div>
    <div class="form-card" data-reveal="right">
      <form data-form="review" novalidate>
        <div class="form-body stack stack-m">
          <h3 class="h3">Расскажите о визите</h3>
          <div class="form-grid">
            <div class="field"><label for="rv-name">Ваше имя <span class="req">*</span></label><input class="input" id="rv-name" name="name" required placeholder="Как вас зовут"><span class="field__err">Укажите имя</span></div>
            <div class="field"><label for="rv-pet">Имя питомца</label><input class="input" id="rv-pet" name="pet" placeholder="Например, Муся"></div>
            <div class="field full"><label>Оценка</label>
              <div class="choices">${[5, 4, 3, 2, 1].map((n, i) => `<label class="choice"><input type="radio" name="rate" value="${n}"${i === 0 ? ' checked' : ''}><span>${n} ★</span></label>`).join('')}</div>
            </div>
            <div class="field full"><label for="rv-text">Отзыв <span class="req">*</span></label><textarea class="textarea" id="rv-text" name="text" required placeholder="Что понравилось, а что можно улучшить"></textarea><span class="field__err">Напишите текст отзыва</span></div>
            <div class="full"><label class="checkbox"><input type="checkbox" required><span>Согласен на публикацию отзыва и обработку данных согласно <a href="/privacy/">политике конфиденциальности</a></span></label></div>
          </div>
          <button class="btn btn--primary btn--block" type="submit" data-magnetic>Отправить отзыв</button>
        </div>
        <div class="form-success"><span class="tick">${icon('check')}</span><h3 class="h3">Спасибо за отзыв</h3><p class="soft">Мы прочитаем его в ближайшее время и опубликуем после модерации.</p></div>
      </form>
    </div>
  </div>
</section>
${finaleSection()}`
  });
}

/* ---------------- Акции ---------------- */
export function promoPage() {
  const crumbs = [{ label: 'Главная', href: '/' }, { label: 'Акции', href: '/promo/' }];
  return page({
    title: 'Акции и профилактические программы ветклиники LUMEN VET',
    description: 'Сезонная вакцинация, профилактические чек-апы, комплексные анализы, стерилизация, стоматология и защита от паразитов по специальной цене.',
    path: '/promo/', active: '/promo/', ogKey: 'promo', crumbs,
    body: `
<section class="pagehead surface" data-surface="dark">
  <span class="orb orb--b" aria-hidden="true"></span>
  <div class="container stack stack-m">
    ${breadcrumbs(crumbs)}
    <span class="eyebrow">Акции</span>
    <h1 class="h1 balance" style="max-width:16ch">Забота — это ещё и <em>профилактика</em></h1>
    <p class="lead" style="max-width:56ch">Комплексные программы дешевле, чем те же процедуры по отдельности, и позволяют находить проблемы до появления симптомов.</p>
  </div>
</section>
${promoSection()}
${finaleSection()}`
  });
}

/* ---------------- FAQ ---------------- */
export function faqPage() {
  const crumbs = [{ label: 'Главная', href: '/' }, { label: 'Вопросы и ответы', href: '/faq/' }];
  return page({
    title: 'Частые вопросы о ветеринарной клинике — FAQ | LUMEN VET',
    description: 'Работает ли клиника круглосуточно, можно ли приехать без записи, как подготовиться к операции и УЗИ, где припарковаться и как записаться к врачу.',
    path: '/faq/', active: '/faq/', ogKey: 'faq', crumbs,
    ld: [faqLd(faq)],
    body: `
<section class="pagehead surface" data-surface="dark">
  <span class="orb orb--a" aria-hidden="true"></span>
  <div class="container stack stack-m">
    ${breadcrumbs(crumbs)}
    <span class="eyebrow">Вопросы и ответы</span>
    <h1 class="h1 balance" style="max-width:16ch">Частые вопросы</h1>
    <p class="lead" style="max-width:54ch">Всё, что чаще всего спрашивают на ресепшене и по телефону — в одном месте.</p>
  </div>
</section>
<section class="section surface">
  <div class="container two-col">
    <div class="sticky-side stack stack-m" data-reveal="left">
      <h2 class="h2">Не нашли ответ?</h2>
      <p class="lead">Позвоните — администратор ответит круглосуточно, а профильный врач перезвонит в рабочее время.</p>
      <div class="row">
        <a class="btn btn--primary btn--s btn-phone" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}${esc(clinic.phone)}</a>
        <a class="btn btn--ghost btn--s" href="/contacts/#ask">Задать вопрос</a>
      </div>
      <div class="frame" style="aspect-ratio:4/3;margin-top:1rem">${img(gallery[0].image, gallery[0].alt)}</div>
    </div>
    <div data-reveal="right">${faqBlock(faq, 'allfaq')}</div>
  </div>
</section>
${finaleSection()}`
  });
}

/* ---------------- Политика конфиденциальности ---------------- */
export function privacyPage() {
  const crumbs = [{ label: 'Главная', href: '/' }, { label: 'Политика конфиденциальности', href: '/privacy/' }];
  const sections = [
    ['Общие положения', 'Настоящая политика определяет порядок обработки персональных данных пользователей сайта и посетителей клиники. Оставляя заявку, вы соглашаетесь с условиями обработки данных, изложенными ниже.'],
    ['Какие данные мы собираем', 'Имя, номер телефона, адрес электронной почты, информацию о питомце (кличка, вид, возраст) и текст обращения. Технические данные: тип устройства, браузер, обезличенная статистика посещений.'],
    ['Цели обработки', 'Запись на приём, подтверждение визита, консультирование по вопросам здоровья питомца, отправка результатов исследований и информирование о статусе пациента в стационаре.'],
    ['Передача третьим лицам', 'Мы не передаём персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством, и подрядчиков, обеспечивающих работу сервисов связи, — в объёме, необходимом для оказания услуги.'],
    ['Хранение и защита', 'Данные хранятся на защищённых серверах и в медицинской информационной системе клиники. Доступ имеют только сотрудники, которым он необходим для выполнения обязанностей.'],
    ['Ваши права', 'Вы вправе запросить информацию об обработке ваших данных, потребовать их уточнения, блокирования или удаления, а также отозвать согласие на обработку, направив обращение на адрес электронной почты клиники.'],
    ['Файлы cookie', 'Сайт использует технические cookie для корректной работы интерфейса. Отключить их можно в настройках браузера — на доступность основной информации это не влияет.'],
    ['Контакты', `По вопросам обработки персональных данных: ${clinic.email}, ${clinic.phone}, ${clinic.address}.`]
  ];
  return page({
    title: 'Политика конфиденциальности | LUMEN VET',
    description: 'Порядок обработки и защиты персональных данных пользователей сайта и клиентов ветеринарной клиники LUMEN VET.',
    path: '/privacy/', active: '', ogKey: 'default', crumbs,
    body: `
<section class="section surface" style="padding-top:calc(var(--header-h) + 2.5rem)">
  <div class="container narrow stack stack-m">
    ${breadcrumbs(crumbs)}
    <h1 class="h1">Политика конфиденциальности</h1>
    <p class="lead">Редакция от 2026 года. Документ приведён в демонстрационном виде и подлежит адаптации под реальную организацию.</p>
    <div class="article" style="margin-top:1rem">
      ${sections.map(([h, t], i) => `<h2>${i + 1}. ${esc(h)}</h2><p>${esc(t)}</p>`).join('')}
    </div>
    <a class="btn btn--ghost btn--s" href="/" style="align-self:flex-start;margin-top:1rem">${icon('arrowLeft')}На главную</a>
  </div>
</section>`
  });
}

/* ---------------- 404 ---------------- */
export function notFoundPage() {
  return page({
    title: 'Страница не найдена — LUMEN VET',
    description: 'Такой страницы нет. Вернитесь на главную или позвоните нам — клиника работает круглосуточно.',
    path: '/404.html', active: '', ogKey: 'default', darkTop: true,
    crumbs: [],
    body: `
<section class="hero surface" data-surface="dark" style="min-height:80vh;display:grid;align-items:center">
  <span class="orb orb--a" aria-hidden="true"></span><span class="orb orb--b" aria-hidden="true"></span>
  <div class="container stack stack-m" style="max-width:60ch">
    <span class="eyebrow">Ошибка 404</span>
    <h1 class="h-display" style="font-weight:250">Страница <em>не найдена</em></h1>
    <p class="lead">Возможно, ссылка устарела. А если вы искали помощь прямо сейчас — просто позвоните, мы работаем круглосуточно.</p>
    <div class="row">
      <a class="btn btn--primary" href="/">На главную</a>
      <a class="btn btn--danger btn-phone" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}${esc(clinic.phone)}</a>
      <a class="btn btn--glass" href="/services/">Услуги</a>
      <a class="btn btn--glass" href="/contacts/">Контакты</a>
    </div>
  </div>
</section>`
  });
}
