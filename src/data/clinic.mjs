// Базовые данные клиники. Замените на реальные перед публикацией.
export const clinic = {
  name: 'LUMEN VET',
  nameRu: 'Люмен Вет',
  legalName: 'ООО «Люмен Вет»',
  tagline: 'Ветеринарная клиника нового поколения',
  claim: 'Здоровье питомца начинается с заботы.',
  phone: '+7 (495) 120-24-07',
  phoneHref: '+74951202407',
  phoneEmergency: '+7 (495) 120-24-07',
  email: 'hello@lumenvet.ru',
  address: 'Москва, Пресненская набережная, 12, вход с набережной',
  addressShort: 'Пресненская наб., 12',
  postalCode: '123112',
  city: 'Москва',
  metro: 'Выставочная — 4 мин пешком · Деловой центр — 6 мин',
  parking: 'Подземный паркинг, первые 60 минут бесплатно',
  hours: 'Круглосуточно, без выходных',
  hoursShort: '24/7',
  geo: { lat: 55.749, lng: 37.539 },
  site: 'https://lumenvet.ru',
  founded: 2014,
  socials: [
    { label: 'Telegram', href: 'https://t.me/', icon: 'telegram' },
    { label: 'WhatsApp', href: 'https://wa.me/74951202407', icon: 'whatsapp' },
    { label: 'VK', href: 'https://vk.com/', icon: 'vk' },
    { label: 'YouTube', href: 'https://youtube.com/', icon: 'youtube' }
  ],
  routes: {
    yandex: 'https://yandex.ru/maps/?rtext=~55.749,37.539&rtt=auto',
    google: 'https://www.google.com/maps/dir/?api=1&destination=55.749,37.539',
    twogis: 'https://2gis.ru/moscow/directions/points/%7C37.539%2C55.749'
  },
  stats: [
    { value: '24/7', label: 'Приём и экстренная помощь', note: 'Врач в клинике круглосуточно' },
    { value: '11', label: 'Лет клинике', note: 'С 2014 года' },
    { value: '38 000+', label: 'Пациентов', note: 'Собаки, кошки и экзотические животные' },
    { value: '26', label: 'Врачей и ассистентов', note: '9 узких специализаций' },
    { value: '20 мин', label: 'Экспресс-анализы', note: 'Собственная лаборатория' },
    { value: '4.9', label: 'Средняя оценка', note: 'По отзывам за 12 месяцев' }
  ]
};

export const nav = [
  { label: 'Услуги', href: '/services/' },
  { label: 'Врачи', href: '/doctors/' },
  { label: 'Цены', href: '/prices/' },
  { label: 'О клинике', href: '/about/' },
  { label: 'Отзывы', href: '/reviews/' },
  { label: 'Блог', href: '/blog/' },
  { label: 'Контакты', href: '/contacts/' }
];
