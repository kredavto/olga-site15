// Inline SVG icon set (stroke-based, 24x24). Kept tiny and consistent.
const S = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}${extra}</svg>`;

export const icons = {
  phone: S('<path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/>'),
  clock: S('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/>'),
  pin: S('<path d="M12 21s6.5-5.6 6.5-10a6.5 6.5 0 1 0-13 0c0 4.4 6.5 10 6.5 10Z"/><circle cx="12" cy="11" r="2.4"/>'),
  route: S('<circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.4 6H14a3.5 3.5 0 0 1 0 7h-4a3.5 3.5 0 0 0 0 7h5.6"/>'),
  metro: S('<path d="M3 18h18"/><path d="M5 18 8.6 7l3.4 6 3.4-6L19 18"/>'),
  car: S('<path d="M4.5 15.5h15M6 15.5v2M18 15.5v2"/><path d="M5 15.5 6.6 9A2 2 0 0 1 8.5 7.5h7A2 2 0 0 1 17.4 9L19 15.5"/><circle cx="8" cy="13" r=".8"/><circle cx="16" cy="13" r=".8"/>'),
  calendar: S('<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8.5 3.5v3M15.5 3.5v3"/>'),
  arrow: S('<path d="M5 12h13M12.5 6l6 6-6 6"/>'),
  arrowLeft: S('<path d="M19 12H6M11.5 6l-6 6 6 6"/>'),
  arrowUpRight: S('<path d="M7 17 17 7M8.5 7H17v8.5"/>'),
  chevron: S('<path d="m6 9 6 6 6-6"/>'),
  check: S('<path d="m4.5 12.5 5 5 10-11"/>'),
  checkCircle: S('<circle cx="12" cy="12" r="8.6"/><path d="m8.4 12.2 2.5 2.5 4.7-5.2"/>'),
  search: S('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>'),
  close: S('<path d="m6 6 12 12M18 6 6 18"/>'),
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="m12 3.6 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 10l6.1-.8L12 3.6Z"/></svg>',
  stethoscope: S('<path d="M6 3.5v5a4 4 0 0 0 8 0v-5"/><path d="M6 3.5H4.5M14 3.5h1.5"/><path d="M10 16.5v.8a4.2 4.2 0 0 0 8.4 0v-2.1"/><circle cx="18.4" cy="12.6" r="2.1"/>'),
  scalpel: S('<path d="M4 20 9.5 14.5"/><path d="M9.5 14.5 19 5a2.5 2.5 0 0 0-3.5-3.5L8 9.5v5h5Z" transform="translate(0 1.5)"/>'),
  scan: S('<path d="M4 8.5V6a2 2 0 0 1 2-2h2.5M15.5 4H18a2 2 0 0 1 2 2v2.5M20 15.5V18a2 2 0 0 1-2 2h-2.5M8.5 20H6a2 2 0 0 1-2-2v-2.5"/><path d="M4 12h16"/>'),
  shield: S('<path d="M12 3.2 19 6v5.4c0 4.2-3 7.3-7 9.4-4-2.1-7-5.2-7-9.4V6l7-2.8Z"/><path d="m9 12 2 2 4-4.5"/>'),
  tooth: S('<path d="M8 3.5C5.5 3.5 4 5.4 4 8c0 2.2.7 3.6 1.2 6 .4 2 .6 6.5 2.3 6.5s1.5-4.5 2.5-4.5h4c1 0 .8 4.5 2.5 4.5s1.9-4.5 2.3-6.5C19.3 11.6 20 10.2 20 8c0-2.6-1.5-4.5-4-4.5-1.6 0-2.6.9-4 .9s-2.4-.9-4-.9Z"/>'),
  brush: S('<path d="M5 20c2 0 3.5-1.3 3.5-3.2 0-1.4-1-2.3-2.3-2.3S4 15.4 4 16.8C4 18.6 3 19 3 19s.7 1 2 1Z"/><path d="m8.5 14.4 9.3-9.3a2 2 0 0 1 2.8 2.8l-9.3 9.3"/>'),
  derm: S('<circle cx="12" cy="12" r="8.5"/><path d="M8.6 9.6h.01M13.4 8.4h.01M10.6 14.6h.01M15.4 13.4h.01"/>'),
  heart: S('<path d="M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20Z"/>'),
  monitor: S('<rect x="3" y="4.5" width="18" height="12" rx="2.5"/><path d="M8 20.5h8M12 16.5v4"/><path d="M6.5 11h2l1.4-3 2.4 5.4L14 11h3.5"/>'),
  team: S('<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><path d="M16 6.4a3 3 0 0 1 0 5.9M17.5 19.5a5.4 5.4 0 0 0-2.2-4.4"/>'),
  siren: S('<path d="M6.5 18.5v-5a5.5 5.5 0 0 1 11 0v5"/><path d="M4.5 18.5h15M12 4V2.5M5.6 6.6 4.5 5.5M18.4 6.6l1.1-1.1"/>'),
  trauma: S('<path d="m5.5 12 4-4M12 5.5 18.5 12 12 18.5 5.5 12Z"/><path d="M9.5 14.5 14.5 9.5"/>'),
  poison: S('<path d="M9 3.5h6l-.6 4.2a6.5 6.5 0 1 1-4.8 0L9 3.5Z"/><path d="M9.5 14h5M12 11.5v5"/>'),
  breath: S('<path d="M4 14c1.6-1.4 3-1.4 4.5 0s2.9 1.4 4.5 0 3-1.4 4.5 0 1.9 1.4 2.5 1"/><path d="M4 9c1.6-1.4 3-1.4 4.5 0s2.9 1.4 4.5 0 3-1.4 4.5 0 1.9 1.4 2.5 1"/>'),
  blood: S('<path d="M12 3.5s5.5 6 5.5 9.6a5.5 5.5 0 0 1-11 0C6.5 9.5 12 3.5 12 3.5Z"/>'),
  seizure: S('<path d="m3.5 13 4-8 3.5 14 3.5-11 2.5 5h3.5"/>'),
  alert: S('<path d="M12 4.5 21 19.5H3L12 4.5Z"/><path d="M12 10v4M12 16.8h.01"/>'),
  'post-op': S('<rect x="3.5" y="8.5" width="17" height="11" rx="2.5"/><path d="M8.5 8.5v-2a3.5 3.5 0 0 1 7 0v2"/><path d="M12 12v4M10 14h4"/>'),
  mail: S('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.8 6.5 8.2 6 8.2-6"/>'),
  doc: S('<path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-5.5-5.5Z"/><path d="M13.5 3.5V9H19"/>'),
  chat: S('<path d="M20.5 12a7.5 7.5 0 0 1-11 6.6L4 20l1.4-4.6A7.5 7.5 0 1 1 20.5 12Z"/>'),
  play: S('<path d="M8 5.5 18.5 12 8 18.5Z"/>'),
  telegram: S('<path d="m21 4-2.9 15.2c-.2 1-.8 1.3-1.6.8l-4.4-3.3-2.1 2c-.3.3-.5.5-1 .5l.4-4.5L17.5 7c.3-.3-.1-.5-.5-.2l-9.4 5.9-4-1.3c-.9-.3-.9-.9.2-1.3l17-6.6c.7-.3 1.4.2 1.2 1.5Z"/>'),
  whatsapp: S('<path d="M3.5 20.5 5 16.4A8 8 0 1 1 8.1 19.4l-4.6 1.1Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5"/>'),
  vk: S('<path d="M4 7.5h3c.4 3.4 1.9 5.8 3 5.8.8 0 1-.4 1-2.6V7.5h2.8v4c1.2-.2 2.4-1.8 3.2-4h2.7c-.6 2.4-1.9 4.2-3.1 5 1.1.7 2.6 2.3 3.4 4h-3c-.7-1.4-1.9-2.7-3.2-2.9v2.9h-1.4C7.9 16.5 5 12.6 4 7.5Z"/>'),
  youtube: S('<rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="m10.5 9.6 4.5 2.4-4.5 2.4Z"/>'),
  award: S('<circle cx="12" cy="9.5" r="5"/><path d="m8.5 13.5-1 7 4.5-2.4 4.5 2.4-1-7"/>'),
  lab: S('<path d="M10 3.5v6.2L5.2 18a2 2 0 0 0 1.7 3h10.2a2 2 0 0 0 1.7-3L14 9.7V3.5"/><path d="M9 3.5h6M8.2 14.5h7.6"/>'),
  info: S('<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5M12 8.2h.01"/>'),
  paw: S('<ellipse cx="7" cy="9" rx="1.9" ry="2.4"/><ellipse cx="12" cy="7.2" rx="1.9" ry="2.5"/><ellipse cx="17" cy="9" rx="1.9" ry="2.4"/><path d="M12 12.5c-2.6 0-4.7 2-4.7 4.1 0 1.6 1.3 2.6 2.9 2.4 1.2-.2 2.4-.2 3.6 0 1.6.2 2.9-.8 2.9-2.4 0-2.1-2.1-4.1-4.7-4.1Z"/>'),
  wallet: S('<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16.5 14.5h.01"/>'),
  sparkle: S('<path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 20.5l-1.8-5.9L4.5 12.8 10.2 11 12 3.5Z"/>')
};

export const icon = (name, cls = 'ico') => {
  const svg = icons[name] || icons.sparkle;
  return svg.replace('<svg ', `<svg class="${cls}" `);
};
