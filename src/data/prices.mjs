// Прайс-лист. Цены ориентировочные — итог определяет врач после осмотра.
export const priceGroups = [
  {
    id: 'priem', title: 'Приём и консультации', service: 'therapy',
    items: [
      { name: 'Первичный приём терапевта', price: 2400, unit: '', note: 'Осмотр, консультация, протокол приёма', popular: true },
      { name: 'Повторный приём терапевта', price: 1600, unit: '' },
      { name: 'Приём узкого специалиста', price: 3200, unit: '', note: 'Кардиолог, дерматолог, стоматолог' },
      { name: 'Консультация по результатам исследований', price: 1400, unit: '' },
      { name: 'Приём в ночное время (23:00–08:00)', price: 3600, unit: '' },
      { name: 'Экстренный приём вне очереди', price: 3900, unit: '', note: 'Приоритетная сортировка, стабилизация', popular: true },
      { name: 'Онлайн-консультация', price: 1500, unit: '' }
    ]
  },
  {
    id: 'diagnostika', title: 'Диагностика', service: 'diagnostics',
    items: [
      { name: 'УЗИ брюшной полости', price: 3200, unit: '', popular: true },
      { name: 'УЗИ мочевого пузыря и почек', price: 2100, unit: '' },
      { name: 'УЗИ на беременность', price: 1900, unit: '' },
      { name: 'ЭхоКГ (УЗИ сердца)', price: 4200, unit: '', note: 'С заключением кардиолога' },
      { name: 'ЭКГ', price: 1600, unit: '' },
      { name: 'Измерение артериального давления', price: 900, unit: '' },
      { name: 'Экспресс-панель критических показателей', price: 2600, unit: '', note: 'Результат за 20 минут', popular: true },
      { name: 'Отоскопия', price: 1200, unit: '' }
    ]
  },
  {
    id: 'analizy', title: 'Анализы и лаборатория', service: 'diagnostics',
    items: [
      { name: 'Клинический анализ крови', price: 1200, unit: '' },
      { name: 'Биохимический анализ крови (базовый профиль)', price: 2900, unit: '', popular: true },
      { name: 'Биохимия расширенная', price: 4600, unit: '' },
      { name: 'Общий анализ мочи', price: 1100, unit: '' },
      { name: 'Анализ кала', price: 950, unit: '' },
      { name: 'Соскоб / цитология кожи', price: 1400, unit: '' },
      { name: 'Гистологическое исследование', price: 4800, unit: '', note: 'Срок 5–10 дней' },
      { name: 'Гормональная панель (Т4, кортизол)', price: 3300, unit: '' }
    ]
  },
  {
    id: 'vakcinaciya', title: 'Вакцинация и документы', service: 'vaccination',
    items: [
      { name: 'Комплексная вакцинация (без бешенства)', price: 2100, unit: '', popular: true },
      { name: 'Комплексная вакцинация + бешенство', price: 2600, unit: '' },
      { name: 'Вакцинация от бешенства', price: 1400, unit: '' },
      { name: 'Первичный курс для щенка / котёнка', price: 4700, unit: '', note: 'Две вакцинации с осмотрами' },
      { name: 'Оформление ветеринарного паспорта', price: 700, unit: '' },
      { name: 'Ветеринарная справка формы №1', price: 1900, unit: '' },
      { name: 'Чипирование', price: 2300, unit: '' },
      { name: 'Обработка от паразитов', price: 600, unit: '' }
    ]
  },
  {
    id: 'hirurgiya', title: 'Хирургия и анестезия', service: 'surgery',
    items: [
      { name: 'Стерилизация кошки', price: 9800, unit: '', note: 'Наркоз, операция, шовный материал, попона', popular: true },
      { name: 'Кастрация кота', price: 5400, unit: '' },
      { name: 'Стерилизация собаки', price: 16500, unit: '', note: 'Зависит от веса' },
      { name: 'Кастрация кобеля', price: 11200, unit: '' },
      { name: 'Удаление новообразования кожи', price: 8600, unit: '' },
      { name: 'Полостная операция (средняя сложность)', price: 24000, unit: '' },
      { name: 'Экстренная операция', price: 32000, unit: '', note: 'Круглосуточно' },
      { name: 'Анестезиологическое пособие', price: 4200, unit: '', note: 'Ингаляционный наркоз, мониторинг' }
    ]
  },
  {
    id: 'stomatologiya', title: 'Стоматология', service: 'dentistry',
    items: [
      { name: 'Ультразвуковая чистка зубов с полировкой', price: 6500, unit: '', note: 'Под наркозом', popular: true },
      { name: 'Стоматологический осмотр', price: 1800, unit: '' },
      { name: 'Удаление зуба (простое)', price: 1900, unit: '' },
      { name: 'Удаление зуба (сложное, с лоскутом)', price: 4400, unit: '' },
      { name: 'Санация ротовой полости', price: 8900, unit: '' },
      { name: 'Лечение стоматита у кошек', price: 5200, unit: '' }
    ]
  },
  {
    id: 'gruming', title: 'Груминг и гигиена', service: 'grooming',
    items: [
      { name: 'Гигиеническая стрижка (кошка)', price: 3400, unit: '' },
      { name: 'Модельная стрижка (собака до 10 кг)', price: 3900, unit: '', popular: true },
      { name: 'Модельная стрижка (собака 10–25 кг)', price: 5600, unit: '' },
      { name: 'Мытьё и сушка', price: 2800, unit: '' },
      { name: 'Экспресс-линька', price: 3200, unit: '' },
      { name: 'Стрижка когтей', price: 600, unit: '' },
      { name: 'Чистка ушей', price: 700, unit: '' },
      { name: 'Расчёсывание колтунов', price: 1500, unit: '/ 30 мин' }
    ]
  },
  {
    id: 'stacionar', title: 'Стационар', service: 'hospital',
    items: [
      { name: 'Сутки в стационаре (кошка)', price: 3500, unit: '/ сутки', note: 'Наблюдение, кормление, базовый мониторинг', popular: true },
      { name: 'Сутки в стационаре (собака)', price: 4200, unit: '/ сутки' },
      { name: 'Сутки в интенсивной терапии', price: 7400, unit: '/ сутки' },
      { name: 'Инфузионная терапия', price: 1600, unit: '/ сеанс' },
      { name: 'Кислородная поддержка', price: 2400, unit: '/ 4 часа' },
      { name: 'Дневной стационар', price: 2200, unit: '/ до 8 часов' }
    ]
  }
];

// Калькулятор ориентировочной стоимости
export const calculator = {
  species: [
    { id: 'dog', label: 'Собака', k: 1.25 },
    { id: 'cat', label: 'Кошка', k: 1 },
    { id: 'other', label: 'Другое животное', k: 1.15, note: 'Грызуны, кролики, хорьки, птицы' }
  ],
  weights: [
    { id: 'xs', label: 'до 5 кг', k: 0.9 },
    { id: 's', label: '5–10 кг', k: 1 },
    { id: 'm', label: '10–25 кг', k: 1.2 },
    { id: 'l', label: 'более 25 кг', k: 1.45 }
  ],
  services: [
    { id: 'consult', label: 'Первичный приём', base: 2400 },
    { id: 'checkup', label: 'Профилактический чек-ап', base: 6900 },
    { id: 'vacc', label: 'Комплексная вакцинация', base: 2600 },
    { id: 'usg', label: 'УЗИ брюшной полости', base: 3200 },
    { id: 'sterilization', label: 'Стерилизация / кастрация', base: 9800 },
    { id: 'dental', label: 'УЗ-чистка зубов', base: 6500 },
    { id: 'grooming', label: 'Груминг', base: 3400 },
    { id: 'hospital', label: 'Сутки стационара', base: 3500 }
  ],
  extras: [
    { id: 'blood', label: 'Анализы крови', add: 2900 },
    { id: 'anesthesia', label: 'Анестезиологическое пособие', add: 4200 },
    { id: 'echo', label: 'ЭхоКГ перед наркозом', add: 4200 },
    { id: 'night', label: 'Ночное время (23:00–08:00)', mult: 1.25 },
    { id: 'stay', label: 'Сутки наблюдения после процедуры', add: 3500 }
  ]
};
