import { clinic } from '../data/clinic.mjs';
import { posts, postBySlug, categories } from '../data/posts.mjs';
import { doctorBySlug } from '../data/doctors.mjs';
import { page, breadcrumbs } from '../lib/layout.mjs';
import { esc, attr, img, dateRu, plural, seoTitle } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { postCard, finaleSection, faqBlock, faqLd } from '../lib/blocks.mjs';

export function blogIndex() {
  const crumbs = [{ label: 'Главная', href: '/' }, { label: 'Блог', href: '/blog/' }];
  const used = categories.filter((c) => posts.some((p) => p.cat === c.id));
  return page({
    title: 'Блог о здоровье собак и кошек | LUMEN VET',
    description: 'Полезные статьи ветеринарных врачей: здоровье, питание, вакцинация, профилактика, поведение, уход, первая помощь, щенки, котята и пожилые животные.',
    path: '/blog/', active: '/blog/', ogKey: 'blog', crumbs,
    ld: [{
      '@context': 'https://schema.org', '@type': 'Blog',
      name: 'Блог LUMEN VET', url: clinic.site + '/blog/',
      blogPost: posts.map((p) => ({
        '@type': 'BlogPosting', headline: p.title, datePublished: p.date,
        url: `${clinic.site}/blog/${p.slug}/`
      }))
    }],
    body: `
<section class="pagehead surface" data-surface="dark">
  <span class="orb orb--c" aria-hidden="true"></span>
  <div class="container stack stack-m">
    ${breadcrumbs(crumbs)}
    <span class="eyebrow">Блог</span>
    <h1 class="h1 balance" style="max-width:18ch">Полезно знать <em>каждому владельцу</em></h1>
    <p class="lead" style="max-width:56ch">Статьи пишут врачи клиники — без страшилок и рекламы препаратов, только то, что действительно помогает принимать решения.</p>
  </div>
</section>
<section class="section surface">
  <div class="container">
    <div class="filters" data-filter-group="blog" data-filter-target=".post-card" data-filter-empty="#blog-empty">
      <button class="filter" type="button" data-value="all" aria-pressed="true">Все статьи</button>
      ${used.map((c) => `<button class="filter" type="button" data-value="${attr(c.id)}" aria-pressed="false">${esc(c.label)}</button>`).join('')}
    </div>
    <div class="posts" data-stagger>
      ${posts.map((p, i) => postCard(p, i === 0)).join('')}
    </div>
    <p class="price-empty" id="blog-empty">В этой категории пока нет статей.</p>
  </div>
</section>
${finaleSection()}`
  });
}

export function postPage(slug) {
  const p = postBySlug[slug];
  const cat = categories.find((c) => c.id === p.cat);
  const author = doctorBySlug[p.author];
  const crumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Блог', href: '/blog/' },
    { label: p.title, href: `/blog/${p.slug}/` }
  ];
  const more = posts.filter((x) => x.slug !== p.slug && x.cat === p.cat).concat(posts.filter((x) => x.slug !== p.slug)).slice(0, 3);

  const body = p.body.map((b) => {
    if (b.h2) return `<h2>${esc(b.h2)}</h2>`;
    if (b.h3) return `<h3>${esc(b.h3)}</h3>`;
    if (b.p) return `<p>${esc(b.p)}</p>`;
    if (b.list) return `<ul>${b.list.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
    if (b.callout) return `<div class="callout">${icon('info')}<span>${esc(b.callout)}</span></div>`;
    return '';
  }).join('\n');

  return page({
    title: seoTitle(p.title, 'Блог LUMEN VET'),
    description: p.excerpt,
    path: `/blog/${p.slug}/`, active: '/blog/', ogKey: `post-${p.slug}`, crumbs,
    ld: [
      faqLd(p.faq),
      {
        '@context': 'https://schema.org', '@type': 'BlogPosting',
        headline: p.title, description: p.excerpt,
        image: `${clinic.site}/assets/img/${p.image}.svg`,
        datePublished: p.date, dateModified: p.date,
        inLanguage: 'ru-RU',
        articleSection: cat ? cat.label : undefined,
        wordCount: p.body.reduce((a, b) => a + ((b.p || b.h2 || '') + (b.list || []).join(' ')).split(/\s+/).length, 0),
        timeRequired: `PT${p.read}M`,
        author: author ? { '@type': 'Person', name: author.name, jobTitle: author.role, url: `${clinic.site}/doctors/${author.slug}/` } : undefined,
        publisher: { '@id': clinic.site + '/#clinic' },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${clinic.site}/blog/${p.slug}/` }
      }
    ],
    body: `
<article class="section surface" style="padding-top:calc(var(--header-h) + 2rem)">
  <div class="container narrow stack stack-m">
    ${breadcrumbs(crumbs)}
    <div class="post-card__meta">
      <span class="post-card__cat">${esc(cat ? cat.label : '')}</span><span>·</span>
      <time datetime="${attr(p.date)}">${esc(dateRu(p.date))}</time><span>·</span>
      <span>${esc(plural(p.read, 'минута', 'минуты', 'минут'))} чтения</span>
    </div>
    <h1 class="h1 balance">${esc(p.title)}</h1>
    <p class="lead">${esc(p.excerpt)}</p>
    ${author ? `<a class="row" href="/doctors/${attr(author.slug)}/" style="gap:.85rem;align-items:center;text-decoration:none">
      ${img(author.image, author.name, { class: 'review__ava' })}
      <span class="stack stack-xs"><b>${esc(author.name)}</b><span class="small muted">${esc(author.role)}</span></span>
    </a>` : ''}
  </div>
  <div class="container" style="margin-block:2rem">
    <div class="frame narrow" style="aspect-ratio:16/8">${img(p.image, p.title, { eager: true })}</div>
  </div>
  <div class="container">
    <div class="article">${body}</div>
  </div>
</article>

<section class="section section--tight surface surface--alt">
  <div class="container narrow stack stack-m">
    <h2 class="h2">Частые вопросы по теме</h2>
    ${faqBlock(p.faq, 'postfaq')}
  </div>
</section>

<section class="section section--tight surface">
  <div class="container narrow">
    <div class="card card--solid stack stack-m" style="text-align:center;align-items:center">
      <span class="chip chip--accent"><i class="pulse-dot" aria-hidden="true"></i>Круглосуточно 24/7</span>
      <h2 class="h3 balance" style="max-width:26ch">Остались вопросы о здоровье питомца?</h2>
      <p class="soft" style="max-width:52ch">Задайте вопрос врачу или запишитесь на приём. При экстренном состоянии звоните сразу — мы принимаем без записи.</p>
      <div class="row" style="justify-content:center">
        <a class="btn btn--primary" href="/booking/">${icon('calendar')}Записаться на приём</a>
        <a class="btn btn--ghost btn-phone" href="tel:${attr(clinic.phoneHref)}">${icon('phone')}${esc(clinic.phone)}</a>
      </div>
    </div>
  </div>
</section>

<section class="section surface surface--alt">
  <div class="container">
    <div class="section-head" data-reveal><span class="eyebrow">Читайте также</span><h2 class="h2">Другие статьи</h2></div>
    <div class="posts" data-stagger>${more.map((x) => postCard(x)).join('')}</div>
  </div>
</section>
${finaleSection()}`
  });
}
