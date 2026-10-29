/* =====================================================================
   CHINMAY MESHRAM · PORTFOLIO
   Renders content from data.js and drives the motion:
   intro curtain, hero reveal, smooth scroll (Lenis), scroll-triggered
   reveals and stacking cards (GSAP), tone switching, hover previews.
   If GSAP or Lenis fail to load, everything stays visible and usable.
   ===================================================================== */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad2 = (n) => String(n).padStart(2, '0');

  const data = window.PORTFOLIO || { featured: [], archive: [], certificates: [] };
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const animate = hasGSAP && !reduceMotion;
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------------
     1. Render content
     ------------------------------------------------------------------ */
  const linkHTML = (p, cls) => [
    p.live && `<a class="${cls}" href="${esc(p.live)}" target="_blank" rel="noopener">Live <span aria-hidden="true">↗</span></a>`,
    p.github && `<a class="${cls}" href="${esc(p.github)}" target="_blank" rel="noopener">Code <span aria-hidden="true">↗</span></a>`,
  ].filter(Boolean).join('');

  $('#cases').innerHTML = data.featured.map((p, i) => {
    const [main, sub] = p.images || [];
    return `
    <article class="case" aria-label="${esc(p.title)}">
      <div class="case__inner">
        <div class="case__info">
          <p class="case__meta"><b>${pad2(i + 1)}</b><span>${esc(p.type)}${p.year ? ' · ' + esc(p.year) : ''}</span></p>
          <h3 class="case__title">${esc(p.title)}</h3>
          <p class="case__summary">${esc(p.summary)}</p>
          <dl class="case__points">
            <div><dt>Problem</dt><dd>${esc(p.problem)}</dd></div>
            <div><dt>Built</dt><dd>${esc(p.built)}</dd></div>
            <div><dt>Result</dt><dd>${esc(p.result)}</dd></div>
          </dl>
          <div class="case__foot">
            <ul class="chips">${(p.stack || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
            <div class="case__links">${linkHTML(p, 'link-arrow')}</div>
          </div>
        </div>
        <div class="case__media">
          ${main ? `<figure class="shot shot--main"><img src="${esc(main)}" alt="${esc(p.title)} screenshot" loading="lazy" /></figure>` : `<div class="case__placeholder">${esc(p.title)}</div>`}
          ${sub ? `<figure class="shot shot--sub"><img src="${esc(sub)}" alt="" loading="lazy" /></figure>` : ''}
        </div>
      </div>
    </article>`;
  }).join('');

  // missing screenshots: drop the small one, replace the main one with a title panel
  $$('.shot img').forEach((img) => img.addEventListener('error', () => {
    const fig = img.closest('.shot');
    if (fig.classList.contains('shot--sub')) return fig.remove();
    const title = img.closest('.case').getAttribute('aria-label');
    fig.outerHTML = `<div class="case__placeholder">${esc(title)}</div>`;
  }));

  $('#archiveList').innerHTML = data.archive.map((p, i) => `
    <li class="row" data-preview="${esc(p.image || '')}">
      <span class="row__i">${pad2(i + 1)}</span>
      <span class="row__title">${esc(p.title)}</span>
      <span class="row__meta">${esc(p.type)}</span>
      <span class="row__meta row__meta--stack">${esc((p.stack || []).join(' · '))}</span>
      <span class="row__links">${linkHTML(p, '') || '<span class="row__none">—</span>'}</span>
    </li>`).join('');

  $('#certList').innerHTML = data.certificates.map((c, i) => `
    <li class="row" data-preview="${esc(c.image)}">
      <span class="row__i">${pad2(i + 1)}</span>
      <span class="row__title">${esc(c.title)}</span>
      <span class="row__meta">${esc(c.issuer)}</span>
      <span class="row__meta">${esc(c.date || '')}</span>
      <span class="row__links">
        <button type="button" data-cert="${i}">View</button>
        ${c.verify ? `<a href="${esc(c.verify)}" target="_blank" rel="noopener">Verify ↗</a>` : ''}
      </span>
    </li>`).join('');

  $('#year').textContent = new Date().getFullYear();

  // preview images that fail to load should not show an empty box
  $$('[data-preview]').forEach((row) => {
    const src = row.dataset.preview;
    if (!src) return;
    const probe = new Image();
    probe.onerror = () => { row.dataset.preview = ''; };
    probe.src = src;
  });

  /* ------------------------------------------------------------------
     2. Live clock (Pune)
     ------------------------------------------------------------------ */
  const clock = $('#clock');
  const fmt = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
  const tick = () => { clock.textContent = fmt.format(new Date()).toUpperCase(); };
  tick();
  setInterval(tick, 15000);

  /* ------------------------------------------------------------------
     3. Text splitting
     ------------------------------------------------------------------ */
  function splitWords(el) {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const inner = document.createElement('span'); inner.textContent = t;
            w.appendChild(inner); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('pill')) {
          walk(n);
        }
      });
    };
    walk(el);
    return $$('.w > span', el);
  }

  function splitChars(el) {
    const target = el.querySelector('em') || el;
    const text = target.textContent;
    target.textContent = '';
    [...text].forEach((ch) => {
      const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch;
      target.appendChild(s);
    });
    return $$('.ch', target);
  }

  /* ------------------------------------------------------------------
     4. Smooth scroll + anchors
     ------------------------------------------------------------------ */
  let lenis = null;
  if (typeof Lenis !== 'undefined' && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  const menu = $('#menu'), menuBtn = $('#menuBtn');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    setMenu(false);
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else (typeof target === 'number' ? scrollTo({ top: 0, behavior: 'smooth' }) : target.scrollIntoView({ behavior: 'smooth' }));
  });

  /* ------------------------------------------------------------------
     5. Tone switching (paper ↔ ink) and active nav link
     ------------------------------------------------------------------ */
  const darkNow = new Set();
  const toneObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => (en.isIntersecting ? darkNow.add(en.target) : darkNow.delete(en.target)));
    document.documentElement.classList.toggle('is-dark', darkNow.size > 0);
  }, { rootMargin: '-50% 0px -50% 0px' });
  $$('[data-tone="dark"]').forEach((s) => toneObserver.observe(s));

  const navLinks = $$('.nav__links a');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  ['work', 'about', 'experience', 'certificates', 'contact'].forEach((id) => navObserver.observe(document.getElementById(id)));

  /* ------------------------------------------------------------------
     6. Certificate viewer
     ------------------------------------------------------------------ */
  const viewer = $('#viewer');
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cert]');
    const row = !btn && !e.target.closest('a') && e.target.closest('#certList .row');
    if (!btn && !row) return;
    const i = btn ? +btn.dataset.cert : $$('#certList .row').indexOf(row);
    const c = data.certificates[i];
    $('#viewerImg').src = c.image;
    $('#viewerImg').alt = c.title + ' certificate';
    $('#viewerCap').textContent = `${c.title} · ${c.issuer}`;
    viewer.showModal();
    if (lenis) lenis.stop();
  });
  viewer.addEventListener('close', () => { if (lenis) lenis.start(); });
  $('#viewerClose').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', (e) => { if (e.target === viewer) viewer.close(); });

  /* ------------------------------------------------------------------
     6b. Contact options (WhatsApp / Gmail / copy). Plain mailto links do
         nothing on computers without an email app, so offer choices.
     ------------------------------------------------------------------ */
  const reach = $('#reach');
  const EMAIL = 'chinmaymeshram27@gmail.com';
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-contact]');
    if (!trigger) return;
    e.preventDefault();
    setMenu(false);
    reach.showModal();
    if (lenis) lenis.stop();
  });
  reach.addEventListener('close', () => { if (lenis) lenis.start(); });
  $('#reachClose').addEventListener('click', () => reach.close());
  reach.addEventListener('click', (e) => { if (e.target === reach) reach.close(); });

  const copyBtn = $('#copyEmail');
  copyBtn.addEventListener('click', async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(EMAIL); ok = true; } catch (err) {
      // older browsers / file:// pages: fall back to a temporary text field
      const t = document.createElement('textarea');
      t.value = EMAIL; t.style.position = 'fixed'; t.style.opacity = '0';
      reach.appendChild(t); t.select();
      try { ok = document.execCommand('copy'); } catch (err2) { ok = false; }
      t.remove();
    }
    copyBtn.textContent = ok ? 'Copied ✓' : EMAIL;
    setTimeout(() => { copyBtn.textContent = 'Copy email address'; }, 2200);
  });

  /* ------------------------------------------------------------------
     7. Pointer interactions (desktop only)
     ------------------------------------------------------------------ */
  if (finePointer && !reduceMotion) {
    // floating preview that follows the cursor over list rows
    const preview = $('#preview'), previewImg = $('#previewImg');
    let px = 0, py = 0, tx = 0, ty = 0, on = false;
    $$('[data-preview]').forEach((row) => {
      row.addEventListener('pointerenter', () => {
        if (!row.dataset.preview) return;
        if (previewImg.getAttribute('src') !== row.dataset.preview) previewImg.src = row.dataset.preview;
        on = true; preview.classList.add('is-on');
      });
      row.addEventListener('pointerleave', () => { on = false; preview.classList.remove('is-on'); });
    });
    window.addEventListener('pointermove', (e) => {
      const w = preview.offsetWidth, h = preview.offsetHeight;
      tx = e.clientX + 28 + w > innerWidth ? e.clientX - w - 28 : e.clientX + 28;
      ty = Math.min(Math.max(e.clientY - h / 2, 12), innerHeight - h - 12);
      if (!on) { px = tx; py = ty; }
    });
    (function loop() {
      const dx = tx - px;
      px += dx * 0.14; py += (ty - py) * 0.14;
      const rot = Math.max(-8, Math.min(8, dx * 0.04));
      preview.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(${rot}deg)`;
      requestAnimationFrame(loop);
    })();

    if (hasGSAP) {
      // portrait leans toward the cursor
      const portrait = $('#portrait');
      $('#top').addEventListener('pointermove', (e) => {
        const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
        gsap.to(portrait, { rotateY: nx * 10, rotateX: -ny * 10, x: nx * 14, y: ny * 14, transformPerspective: 900, duration: 1.2, ease: 'power3.out' });
      });
      $('#top').addEventListener('pointerleave', () => gsap.to(portrait, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 1.2, ease: 'power3.out' }));

      // magnetic "Say hello" button
      const hello = $('#hello');
      hello.addEventListener('pointermove', (e) => {
        const r = hello.getBoundingClientRect();
        gsap.to(hello, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.6, ease: 'power3.out' });
      });
      hello.addEventListener('pointerleave', () => gsap.to(hello, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' }));
    }
  }

  /* ------------------------------------------------------------------
     8. Motion (GSAP)
     ------------------------------------------------------------------ */
  const counters = $$('[data-count]');
  const setCount = (el, v) => { const d = +(el.dataset.decimals || 0); el.textContent = d ? v.toFixed(d) : Math.round(v); };

  if (!animate) {
    $('#curtain').remove();
    counters.forEach((el) => setCount(el, +el.dataset.count));
    return;
  }

  const heroChars = [...splitChars($('#heroFirst')), ...splitChars($('#heroLast'))];
  const headingWords = $$('.split').map((el) => ({ el, words: splitWords(el) }));
  const manifestoWords = splitWords($('#manifesto'));

  // hidden starting states (only applied when animation will run)
  gsap.set(heroChars, { yPercent: 115 });
  gsap.set('[data-hero]', { autoAlpha: 0, y: 24 });
  gsap.set('#portrait', { autoAlpha: 0, scale: 0.86 });
  gsap.set('#nav', { autoAlpha: 0 });

  const heroIn = () => gsap.timeline({ defaults: { ease: 'expo.out' } })
    .to(heroChars, { yPercent: 0, duration: 1.5, stagger: 0.045 }, 0)
    .to('#portrait', { autoAlpha: 1, scale: 1, duration: 1.8 }, 0.15)
    .to('#nav', { autoAlpha: 1, duration: 1 }, 0.3)
    .to('[data-hero]', { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.45);

  // the curtain plays fully on the first visit of a session, briefly afterwards
  let seen = false;
  try { seen = sessionStorage.getItem('cm-seen') === '1'; sessionStorage.setItem('cm-seen', '1'); } catch (err) { /* storage blocked */ }
  if (lenis) lenis.stop();
  const curtain = $('#curtain');
  const done = () => { curtain.remove(); if (lenis) lenis.start(); ScrollTrigger.refresh(); };
  if (seen) {
    gsap.to(curtain, { autoAlpha: 0, duration: 0.5, onComplete: done });
    heroIn();
  } else {
    gsap.timeline({ onComplete: done })
      .from('.curtain__name > *', { yPercent: 110, duration: 1, stagger: 0.12, ease: 'expo.out' })
      .to('#curtainLine', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0.2)
      .to('.curtain__name, .curtain__line', { autoAlpha: 0, y: -20, duration: 0.45, ease: 'power2.in' }, '+=0.1')
      .to(curtain, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.15')
      .add(heroIn, '-=0.6');
  }

  // hero drifts apart as you scroll away
  const heroST = { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true };
  gsap.to('#heroFirst', { x: () => -innerWidth * 0.07, ease: 'none', scrollTrigger: heroST });
  gsap.to('#heroLast', { x: () => innerWidth * 0.07, ease: 'none', scrollTrigger: heroST });
  gsap.to('#portraitWrap', { yPercent: 18, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero__intro, .hero__bar', { autoAlpha: 0, y: -30, ease: 'none', scrollTrigger: { trigger: '#top', start: '30% top', end: '75% top', scrub: true } });

  // section headings: words rise from a mask
  headingWords.forEach(({ el, words }) => {
    gsap.from(words, { yPercent: 115, duration: 1.2, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 86%' } });
  });
  $$('.label').forEach((el) => gsap.from(el, { autoAlpha: 0, x: -20, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));

  // manifesto: words rise, image pills open up
  gsap.from(manifestoWords, { yPercent: 115, duration: 1.1, stagger: 0.012, ease: 'expo.out', scrollTrigger: { trigger: '#manifesto', start: 'top 80%' } });
  gsap.from('.pill', { width: 0, duration: 1.2, stagger: 0.15, ease: 'expo.out', delay: 0.3, clearProps: 'width', scrollTrigger: { trigger: '#manifesto', start: 'top 80%' } });

  // generic reveal
  gsap.set('.reveal', { autoAlpha: 0, y: 40 });
  ScrollTrigger.batch('.reveal', {
    start: 'top 90%', once: true,
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', overwrite: true }),
  });

  // counters
  counters.forEach((el) => {
    const o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => gsap.to(o, { v: +el.dataset.count, duration: 2, ease: 'power3.out', onUpdate: () => setCount(el, o.v) }) });
  });

  // list rows slide in
  gsap.set('.row', { autoAlpha: 0, y: 30 });
  ScrollTrigger.batch('.row', {
    start: 'top 94%', once: true,
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', overwrite: true }),
  });

  // case studies: stacking cards on large screens, simple reveals elsewhere
  const mm = gsap.matchMedia();
  mm.add('(min-width: 961px) and (min-height: 681px)', () => {
    const cards = $$('.case');
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (next) {
        gsap.to(card, {
          scale: 0.9, '--dim': 0.55, ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 9%', scrub: true },
        });
      }
      const sub = $('.shot--sub', card), main = $('.shot--main', card);
      if (sub) gsap.fromTo(sub, { y: 90 }, { y: -20, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 9%', scrub: true } });
      if (main) gsap.fromTo(main, { y: 40 }, { y: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 9%', scrub: true } });
      gsap.from($$('.case__meta, .case__title, .case__summary', card), { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 70%' } });
    });
  });
  mm.add('(max-width: 960px), (max-height: 680px)', () => {
    $$('.case').forEach((card) => gsap.from(card, { y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 88%' } }));
  });

  // contact + footer
  gsap.from('.contact__row, .contact__links', { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.contact__row', start: 'top 92%' } });
  gsap.from('.footer__name > *', { yPercent: 60, autoAlpha: 0, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
