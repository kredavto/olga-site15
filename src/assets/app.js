/* LUMEN VET — interactions. Vanilla, no dependencies, deferred. */
(function () {
  'use strict';

  var doc = document, win = window;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var on = function (el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt || false); };
  var raf = win.requestAnimationFrame ? win.requestAnimationFrame.bind(win) : function (f) { return setTimeout(f, 16); };

  /* ---------- Capabilities: downgrade effects on weak devices ---------- */
  var reduce = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = win.matchMedia && win.matchMedia('(pointer: coarse)').matches;
  var conn = navigator.connection || {};
  var weak = reduce
    || (navigator.deviceMemory && navigator.deviceMemory <= 4)
    || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
    || conn.saveData === true
    || /2g/.test(conn.effectiveType || '')
    || win.innerWidth < 820;
  var rich = !reduce && !weak;
  doc.documentElement.dataset.motion = reduce ? 'reduced' : (weak ? 'lite' : 'full');

  /* ---------- Preloader: particles converge into the logo mark ---------- */
  (function preloader() {
    var el = $('#preloader');
    if (!el) return;
    var html = doc.documentElement;
    var bar = $('.preloader__bar i', el);
    var done = false;
    var finish = function () {
      if (done) return; done = true;
      if (bar) bar.style.width = '100%';
      setTimeout(function () {
        el.classList.add('is-done');
        html.classList.remove('is-loading');
        doc.body.dispatchEvent(new CustomEvent('lumen:ready'));
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 800);
      }, 240);
    };

    if (reduce) { if (bar) bar.style.width = '100%'; finish(); return; }

    var cv = $('canvas', el);
    if (cv && cv.getContext) {
      var ctx = cv.getContext('2d');
      var dpr = Math.min(win.devicePixelRatio || 1, 2);
      var S = 190;
      cv.width = S * dpr; cv.height = S * dpr; ctx.scale(dpr, dpr);
      // Target points sampled from a stylised "shield + pulse" mark
      var pts = [];
      var off = doc.createElement('canvas'); off.width = S; off.height = S;
      var octx = off.getContext('2d');
      octx.strokeStyle = '#fff'; octx.lineWidth = 7; octx.lineJoin = 'round'; octx.lineCap = 'round';
      octx.beginPath();
      octx.moveTo(95, 24); octx.lineTo(150, 48); octx.lineTo(150, 100);
      octx.bezierCurveTo(150, 138, 122, 158, 95, 168);
      octx.bezierCurveTo(68, 158, 40, 138, 40, 100);
      octx.lineTo(40, 48); octx.closePath(); octx.stroke();
      octx.beginPath();
      octx.moveTo(58, 100); octx.lineTo(80, 100); octx.lineTo(90, 78); octx.lineTo(103, 122); octx.lineTo(112, 100); octx.lineTo(132, 100);
      octx.stroke();
      var data = octx.getImageData(0, 0, S, S).data;
      for (var y = 0; y < S; y += 3) {
        for (var x = 0; x < S; x += 3) {
          if (data[(y * S + x) * 4 + 3] > 128) pts.push({ x: x, y: y });
        }
      }
      var parts = pts.map(function (p) {
        var a = Math.random() * Math.PI * 2, r = 120 + Math.random() * 190;
        return { tx: p.x, ty: p.y, x: 95 + Math.cos(a) * r, y: 95 + Math.sin(a) * r, d: 0.045 + Math.random() * 0.05 };
      });
      var t0 = performance.now(), rid;
      var draw = function (now) {
        var k = Math.min(1, (now - t0) / 1400);
        ctx.clearRect(0, 0, S, S);
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          p.x += (p.tx - p.x) * p.d * (0.5 + k);
          p.y += (p.ty - p.y) * p.d * (0.5 + k);
          var a = 0.25 + k * 0.75;
          ctx.fillStyle = i % 7 === 0 ? 'rgba(111,224,208,' + a + ')' : 'rgba(190,235,230,' + (a * 0.72) + ')';
          ctx.fillRect(p.x, p.y, 1.9, 1.9);
        }
        if (bar) bar.style.width = Math.round(k * 96) + '%';
        if (k < 1 && !done) rid = raf(draw); else cancelAnimationFrame(rid);
      };
      rid = raf(draw);
    }

    var minTime = setTimeout(finish, 1650);
    on(win, 'load', function () { setTimeout(finish, 420); });
    setTimeout(finish, 4000); // hard safety
    void minTime;
  })();

  /* ---------- Header: sticky, auto-hide, scroll progress ---------- */
  (function header() {
    var head = $('#header'), prog = $('#progress'), bar = $('#mobilebar'), sos = $('#sos');
    var last = win.scrollY, ticking = false;
    var apply = function () {
      var y = win.scrollY;
      var h = doc.documentElement.scrollHeight - win.innerHeight;
      if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
      if (head) {
        head.classList.toggle('is-stuck', y > 24);
        if (head.dataset.theme === 'dark') head.classList.toggle('header--dark', y < 60);
        head.classList.toggle('is-hidden', y > 320 && y > last + 6 && !doc.body.classList.contains('is-locked'));
      }
      if (bar) bar.classList.toggle('is-on', y > 80);
      if (sos) sos.classList.toggle('is-on', y > 640);
      last = y; ticking = false;
    };
    on(win, 'scroll', function () { if (!ticking) { ticking = true; raf(apply); } }, { passive: true });
    apply();
  })();

  /* ---------- Mobile drawer ---------- */
  (function drawer() {
    var btn = $('#burger'), dr = $('#drawer');
    if (!btn || !dr) return;
    var open = false;
    var set = function (v) {
      open = v;
      btn.setAttribute('aria-expanded', String(v));
      doc.body.classList.toggle('is-locked', v);
      doc.body.style.overflow = v ? 'hidden' : '';
      if (v) { dr.classList.add('is-mounted'); raf(function () { dr.classList.add('is-open'); }); }
      else { dr.classList.remove('is-open'); setTimeout(function () { if (!open) dr.classList.remove('is-mounted'); }, 400); }
    };
    on(btn, 'click', function () { set(!open); });
    $$('a', dr).forEach(function (a) { on(a, 'click', function () { set(false); }); });
    on(doc, 'keydown', function (e) { if (e.key === 'Escape' && open) { set(false); btn.focus(); } });
  })();

  /* ---------- Scroll reveal + staggered groups ---------- */
  (function reveal() {
    var items = $$('[data-reveal],[data-stagger]');
    if (!items.length) return;
    if (!('IntersectionObserver' in win) || reduce) { items.forEach(function (n) { n.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (n) {
      if (n.hasAttribute('data-stagger')) {
        Array.prototype.forEach.call(n.children, function (c, i) { c.style.setProperty('--i', i); });
      }
      io.observe(n);
    });
  })();

  /* ---------- Animated counters ---------- */
  (function counters() {
    var els = $$('[data-count]');
    if (!els.length || !('IntersectionObserver' in win)) return;
    if (reduce) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; io.unobserve(el);
        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        var dec = (el.dataset.count.split('.')[1] || '').length;
        var t0 = performance.now(), dur = 1300;
        var tick = function (now) {
          var k = Math.min(1, (now - t0) / dur);
          var v = target * (1 - Math.pow(1 - k, 3));
          el.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('ru-RU')) + suffix;
          if (k < 1) raf(tick);
        };
        raf(tick);
      });
    }, { threshold: 0.4 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---------- Cursor glow + magnetic buttons + card light ---------- */
  (function pointerFx() {
    if (coarse || reduce) return;
    var glow = $('#glow');
    var gx = win.innerWidth / 2, gy = win.innerHeight / 2, cx = gx, cy = gy, active = false;
    if (glow) {
      var loop = function () {
        cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
        glow.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
        raf(loop);
      };
      raf(loop);
    }
    on(win, 'pointermove', function (e) {
      gx = e.clientX; gy = e.clientY;
      if (glow && !active) { active = true; glow.classList.add('is-on'); }
    }, { passive: true });

    // Light follows the pointer inside cards & buttons
    on(doc, 'pointermove', function (e) {
      var t = e.target.closest ? e.target.closest('.card,.btn,.usp__item,.svc,.promo,.review,.pcard,.doccard,.story') : null;
      if (!t) return;
      var r = t.getBoundingClientRect();
      t.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      t.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    }, { passive: true });

    if (!rich) return;
    // Magnetic buttons
    $$('[data-magnetic]').forEach(function (el) {
      var rect = null;
      on(el, 'pointerenter', function () { rect = el.getBoundingClientRect(); });
      on(el, 'pointermove', function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
        var dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
        el.style.transform = 'translate3d(' + (dx * 12) + 'px,' + (dy * 8) + 'px,0)';
      });
      on(el, 'pointerleave', function () { rect = null; el.style.transform = ''; });
    });

    // 3D tilt
    $$('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.dataset.tilt) || 6, rect = null;
      on(el, 'pointerenter', function () { rect = el.getBoundingClientRect(); el.classList.add('is-tilting'); });
      on(el, 'pointermove', function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty('--ry', (px * max).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-py * max).toFixed(2) + 'deg');
      });
      on(el, 'pointerleave', function () {
        rect = null; el.classList.remove('is-tilting');
        el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg');
      });
    });
  })();

  /* ---------- Ambient particles in hero ---------- */
  (function particles() {
    var cv = $('#particles');
    if (!cv || !cv.getContext || reduce) return;
    var ctx = cv.getContext('2d');
    var dpr = Math.min(win.devicePixelRatio || 1, 2);
    var W = 0, H = 0, ps = [], mouse = { x: -999, y: -999 };
    var COUNT = weak ? 22 : 58;
    var size = function () {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    var seed = function () {
      ps = [];
      for (var i = 0; i < COUNT; i++) {
        ps.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
          r: 0.7 + Math.random() * 1.8, a: 0.18 + Math.random() * 0.42
        });
      }
    };
    var visible = true;
    var frame = function () {
      if (!visible) { raf(frame); return; }
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 19600) { var f = (1 - Math.sqrt(d2) / 140) * 0.55; p.vx += (dx / (Math.sqrt(d2) || 1)) * f; p.vy += (dy / (Math.sqrt(d2) || 1)) * f; }
        p.vx *= 0.97; p.vy *= 0.97;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(150,232,220,' + p.a + ')';
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
        if (!weak) {
          for (var j = i + 1; j < ps.length; j++) {
            var q = ps[j], ax = p.x - q.x, ay = p.y - q.y, dd = ax * ax + ay * ay;
            if (dd < 12100) {
              ctx.strokeStyle = 'rgba(111,224,208,' + (0.10 * (1 - dd / 12100)) + ')';
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
            }
          }
        }
      }
      raf(frame);
    };
    size(); seed(); raf(frame);
    on(win, 'resize', function () { size(); seed(); }, { passive: true });
    on(cv.parentNode, 'pointermove', function (e) {
      var r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    }, { passive: true });
    on(cv.parentNode, 'pointerleave', function () { mouse.x = mouse.y = -999; });
    if ('IntersectionObserver' in win) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(cv);
    }
  })();

  /* ---------- Parallax layers ---------- */
  (function parallax() {
    var els = $$('[data-parallax]');
    if (!els.length || reduce || weak) return;
    var ticking = false;
    var apply = function () {
      var vh = win.innerHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var k = (r.top + r.height / 2 - vh / 2) / vh;
        var amt = parseFloat(el.dataset.parallax) || 12;
        el.style.transform = 'translate3d(0,' + (-k * amt).toFixed(2) + '%,0) scale(1.08)';
      });
      ticking = false;
    };
    on(win, 'scroll', function () { if (!ticking) { ticking = true; raf(apply); } }, { passive: true });
    apply();
  })();

  /* ---------- Accordion (FAQ) ---------- */
  (function accordion() {
    $$('[data-accordion]').forEach(function (root) {
      var single = root.dataset.accordion === 'single';
      $$('.faq__q', root).forEach(function (btn) {
        on(btn, 'click', function () {
          var open = btn.getAttribute('aria-expanded') === 'true';
          if (single && !open) {
            $$('.faq__q[aria-expanded="true"]', root).forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
          }
          btn.setAttribute('aria-expanded', String(!open));
        });
      });
    });
  })();

  /* ---------- Horizontal sliders ---------- */
  (function sliders() {
    $$('[data-slider]').forEach(function (root) {
      var track = $('.slider__track', root);
      var prev = $('[data-slider-prev]', root), next = $('[data-slider-next]', root);
      var rail = $('.slider__rail i', root);
      if (!track) return;
      var step = function () {
        var first = track.firstElementChild;
        return first ? first.getBoundingClientRect().width + 20 : 360;
      };
      var upd = function () {
        var max = track.scrollWidth - track.clientWidth;
        if (prev) prev.disabled = track.scrollLeft < 8;
        if (next) next.disabled = track.scrollLeft >= max - 8;
        if (rail) {
          var ratio = track.clientWidth / track.scrollWidth;
          rail.style.width = Math.max(12, ratio * 100) + '%';
          rail.style.transform = 'translateX(' + (max > 0 ? (track.scrollLeft / max) * ((1 / ratio - 1) * 100) : 0) + '%)';
        }
      };
      on(prev, 'click', function () { track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
      on(next, 'click', function () { track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
      on(track, 'scroll', function () { raf(upd); }, { passive: true });
      on(win, 'resize', upd, { passive: true });
      upd();
    });
  })();

  /* ---------- Gallery lightbox ---------- */
  (function lightbox() {
    var box = $('#lightbox');
    if (!box) return;
    var img = $('img', box), cap = $('.lightbox__cap', box);
    var figs = $$('[data-lightbox]');
    var idx = 0;
    var show = function (i) {
      idx = (i + figs.length) % figs.length;
      var f = figs[idx], src = f.dataset.full || $('img', f).src;
      img.src = src;
      img.alt = $('img', f) ? $('img', f).alt : '';
      cap.textContent = f.dataset.caption || '';
    };
    var open = function (i) { show(i); box.classList.add('is-open'); doc.body.style.overflow = 'hidden'; $('.lightbox__close', box).focus(); };
    var close = function () { box.classList.remove('is-open'); doc.body.style.overflow = ''; };
    figs.forEach(function (f, i) {
      on(f, 'click', function () { open(i); });
      f.setAttribute('tabindex', '0');
      on(f, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
    });
    on($('.lightbox__close', box), 'click', close);
    on($('.lightbox__nav.prev', box), 'click', function () { show(idx - 1); });
    on($('.lightbox__nav.next', box), 'click', function () { show(idx + 1); });
    on(box, 'click', function (e) { if (e.target === box) close(); });
    on(doc, 'keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  })();

  /* ---------- Filters (blog categories, price categories) ---------- */
  (function filters() {
    $$('[data-filter-group]').forEach(function (group) {
      var targetSel = group.dataset.filterTarget;
      var items = $$(targetSel);
      var empty = group.dataset.filterEmpty ? $(group.dataset.filterEmpty) : null;
      $$('.filter', group).forEach(function (btn) {
        on(btn, 'click', function () {
          var v = btn.dataset.value;
          $$('.filter', group).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
          var shown = 0;
          items.forEach(function (it) {
            var ok = v === 'all' || (it.dataset.cat || '').split(' ').indexOf(v) > -1;
            it.hidden = !ok; if (ok) shown++;
          });
          if (empty) empty.classList.toggle('is-on', shown === 0);
        });
      });
    });
  })();

  /* ---------- Price search ---------- */
  (function priceSearch() {
    var input = $('#price-search');
    if (!input) return;
    var rows = $$('.pricerow'), groups = $$('.pricegroup'), empty = $('#price-empty');
    var norm = function (s) { return (s || '').toLowerCase().replace(/ё/g, 'е'); };
    var run = function () {
      var q = norm(input.value.trim());
      var total = 0;
      var activeCat = doc.querySelector('[data-filter-group="prices"] .filter[aria-pressed="true"]');
      var cat = activeCat ? activeCat.dataset.value : 'all';
      groups.forEach(function (g) {
        var shown = 0;
        $$('.pricerow', g).forEach(function (r) {
          var okCat = cat === 'all' || g.dataset.cat === cat;
          var okQ = !q || norm(r.dataset.name).indexOf(q) > -1 || norm(g.dataset.title).indexOf(q) > -1;
          var ok = okCat && okQ;
          r.classList.toggle('is-hidden', !ok);
          if (ok) shown++;
        });
        g.classList.toggle('is-hidden', shown === 0);
        total += shown;
      });
      if (empty) empty.classList.toggle('is-on', total === 0);
      void rows;
    };
    on(input, 'input', run);
    $$('[data-filter-group="prices"] .filter').forEach(function (b) {
      on(b, 'click', function () {
        $$('[data-filter-group="prices"] .filter').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        run();
      });
    });
    run();
  })();

  /* ---------- Cost calculator ---------- */
  (function calculator() {
    var form = $('#calc');
    if (!form) return;
    var out = $('#calc-sum'), list = $('#calc-list');
    var fmt = function (n) { return Math.round(n / 10) * 10; };
    var money = function (n) { return n.toLocaleString('ru-RU') + ' ₽'; };
    var run = function () {
      var sp = form.querySelector('input[name="species"]:checked');
      var w = form.querySelector('input[name="weight"]:checked');
      var svc = form.querySelector('select[name="service"]');
      var opt = svc.options[svc.selectedIndex];
      var base = parseFloat(opt.dataset.base) || 0;
      var kS = sp ? parseFloat(sp.dataset.k) : 1;
      var kW = w ? parseFloat(w.dataset.k) : 1;
      var lines = [];
      var sum = base * kS * kW;
      lines.push([opt.textContent, money(fmt(sum))]);
      var mult = 1;
      $$('input[name="extra"]:checked', form).forEach(function (x) {
        if (x.dataset.mult) { mult *= parseFloat(x.dataset.mult); lines.push([x.dataset.label, '×' + x.dataset.mult]); }
        else { var a = parseFloat(x.dataset.add) || 0; sum += a; lines.push([x.dataset.label, money(fmt(a))]); }
      });
      sum *= mult;
      var lo = fmt(sum * 0.9), hi = fmt(sum * 1.18);
      if (out) out.textContent = money(lo) + ' – ' + money(hi);
      if (list) {
        list.innerHTML = lines.map(function (l) {
          return '<div><span>' + l[0] + '</span><b>' + l[1] + '</b></div>';
        }).join('');
      }
    };
    on(form, 'change', run);
    on(form, 'input', run);
    run();
  })();

  /* ---------- Booking wizard ---------- */
  (function wizard() {
    var root = $('#booking');
    if (!root) return;
    var panels = $$('.wizard__panel', root);
    var dots = $$('.wizard__dot', root);
    var bar = $('.wizard__bar i', root);
    var back = $('[data-wz-back]', root), nextBtn = $('[data-wz-next]', root), submit = $('[data-wz-submit]', root);
    var step = 0;

    var valid = function (i) {
      var p = panels[i];
      if (!p) return true;
      var reqs = $$('[data-required]', p);
      var ok = true;
      reqs.forEach(function (g) {
        var name = g.dataset.required;
        var f = root.querySelector('[name="' + name + '"]');
        if (f && (f.type === 'radio')) {
          if (!root.querySelector('[name="' + name + '"]:checked')) ok = false;
        } else if (f && !String(f.value).trim()) {
          ok = false;
          f.closest('.field') && f.closest('.field').classList.add('is-error');
        }
      });
      return ok;
    };

    var summary = function () {
      var box = $('#wz-summary');
      if (!box) return;
      var get = function (n) {
        var el = root.querySelector('[name="' + n + '"]:checked') || root.querySelector('[name="' + n + '"]');
        if (!el) return '—';
        if (el.dataset && el.dataset.label) return el.dataset.label;
        if (el.tagName === 'SELECT') return el.options[el.selectedIndex].textContent;
        return el.value || '—';
      };
      box.innerHTML = [
        ['Питомец', get('species')],
        ['Направление', get('direction')],
        ['Врач', get('doctor')],
        ['Дата', get('date')],
        ['Время', get('time')]
      ].map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('');
    };

    var go = function (i) {
      step = Math.max(0, Math.min(panels.length - 1, i));
      panels.forEach(function (p, n) { p.classList.toggle('is-active', n === step); });
      dots.forEach(function (d, n) {
        d.classList.toggle('is-active', n === step);
        d.classList.toggle('is-done', n < step);
      });
      if (bar) bar.style.width = ((step + 1) / panels.length * 100) + '%';
      if (back) back.hidden = step === 0;
      if (nextBtn) nextBtn.hidden = step === panels.length - 1;
      if (submit) submit.hidden = step !== panels.length - 1;
      if (step === panels.length - 1) summary();
      var top = root.getBoundingClientRect().top + win.scrollY - 110;
      if (win.scrollY > top + 40) win.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    };

    on(nextBtn, 'click', function () {
      if (!valid(step)) { root.classList.add('shake'); setTimeout(function () { root.classList.remove('shake'); }, 500); return; }
      go(step + 1);
    });
    on(back, 'click', function () { go(step - 1); });
    $$('input[type="radio"]', root).forEach(function (r) {
      on(r, 'change', function () {
        if (r.dataset.autonext !== 'false' && step < panels.length - 2) setTimeout(function () { go(step + 1); }, 260);
      });
    });
    go(0);
  })();

  /* ---------- Forms: validation + submit feedback ---------- */
  (function forms() {
    $$('form[data-form]').forEach(function (form) {
      on(form, 'submit', function (e) {
        e.preventDefault();
        var ok = true;
        $$('[required]', form).forEach(function (f) {
          var field = f.closest('.field');
          var bad = f.type === 'checkbox' ? !f.checked : !String(f.value).trim();
          if (!bad && f.type === 'tel') bad = (f.value.replace(/\D/g, '').length < 10);
          if (field) field.classList.toggle('is-error', bad);
          if (bad && ok) { f.focus(); }
          if (bad) ok = false;
        });
        if (!ok) return;
        var btn = form.querySelector('[type="submit"]');
        if (btn) { btn.setAttribute('aria-disabled', 'true'); btn.dataset.label = btn.textContent; btn.textContent = 'Отправляем…'; }
        setTimeout(function () {
          form.classList.add('is-sent');
          var s = form.querySelector('.form-success');
          if (s) { s.classList.add('is-on'); s.setAttribute('tabindex', '-1'); s.focus(); }
          if (btn) { btn.removeAttribute('aria-disabled'); btn.textContent = btn.dataset.label || 'Отправить'; }
        }, 700);
      });
      $$('.input,.select,.textarea', form).forEach(function (f) {
        on(f, 'input', function () { var fl = f.closest('.field'); if (fl) fl.classList.remove('is-error'); });
      });
    });

    // Phone mask (RU)
    $$('input[type="tel"]').forEach(function (input) {
      on(input, 'input', function () {
        var d = input.value.replace(/\D/g, '');
        if (d[0] === '8') d = '7' + d.slice(1);
        if (d[0] !== '7') d = '7' + d;
        d = d.slice(0, 11);
        var out = '+7';
        if (d.length > 1) out += ' (' + d.slice(1, 4);
        if (d.length >= 5) out += ') ' + d.slice(4, 7);
        if (d.length >= 8) out += '-' + d.slice(7, 9);
        if (d.length >= 10) out += '-' + d.slice(9, 11);
        input.value = out;
      });
      on(input, 'focus', function () { if (!input.value) input.value = '+7 ('; });
    });
  })();

  /* ---------- Split-text hero reveal ---------- */
  (function splitText() {
    if (reduce) return;
    $$('[data-split]').forEach(function (el) {
      var lines = $$('.split-line', el);
      lines.forEach(function (l, i) { l.style.setProperty('--i', i); });
      setTimeout(function () { el.classList.add('is-in'); }, 120);
    });
    doc.body.addEventListener('lumen:ready', function () {
      $$('[data-split]').forEach(function (el) { el.classList.add('is-in'); });
    });
  })();

  /* ---------- Smooth anchor scroll with header offset ---------- */
  on(doc, 'click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var t = doc.getElementById(id.slice(1));
    if (!t) return;
    e.preventDefault();
    var top = t.getBoundingClientRect().top + win.scrollY - 92;
    win.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
    if (history.replaceState) history.replaceState(null, '', id);
  });

  /* ---------- Prefill booking form from links (?service=…) ---------- */
  (function prefill() {
    var params = new URLSearchParams(location.search);
    ['service', 'doctor'].forEach(function (k) {
      var v = params.get(k);
      if (!v) return;
      var el = doc.querySelector('[name="' + (k === 'service' ? 'direction' : 'doctor') + '"][value="' + v + '"]');
      if (el) { el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); }
      var sel = doc.querySelector('select[name="topic"]');
      if (sel && k === 'service') {
        Array.prototype.forEach.call(sel.options, function (o) { if (o.value === v) sel.value = v; });
      }
    });
  })();
})();
