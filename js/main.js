/*
  main.js (Enduro Bike Service)
  - Mobile nav toggle (keyboard accessible)
  - Smooth scrolling for in-page anchors
  - Active nav state on scroll
  - Footer year
  - Cookie banner consent (GDPR-lite, localStorage)

  NOTE: This file supports both the Home layout and inner pages.
*/

(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ----------------------------
  // Hero background video (local MP4 or Vimeo)
  // Configured in /js/data.js as ENDURO_DATA.site.heroVideo
  // ----------------------------
  function getVimeoId(src){
    if (!src) return '';
    const s = String(src).trim();
    const m1 = s.match(/^vimeo:(\d+)$/i);
    if (m1) return m1[1];
    const m2 = s.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (m2) return m2[1];
    return '';
  }

  // function buildVimeoBackgroundUrl(id){
  //   const params = new URLSearchParams({
  //     background: '1',
  //     autoplay: '1',
  //     loop: '1',
  //     muted: '1',
  //     title: '0',
  //     byline: '0',
  //     portrait: '0'
  //   });
  //   return `https://player.vimeo.com/video/${encodeURIComponent(id)}?${params.toString()}`;
  // }

  function buildVimeoBackgroundUrl(id){
    const params = new URLSearchParams({
      background: '1',
      autoplay: '1',
      loop: '1',
      muted: '1',
      playsinline: '1',
      title: '0',
      byline: '0',
      portrait: '0'
    });
    return `https://player.vimeo.com/video/${encodeURIComponent(id)}?${params.toString()}`;
  }

  function initHeroMedia(){
    const mount = document.querySelector('[data-hero-media]');
    if (!mount) return;

    const lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
    const site = (window.ENDURO_DATA && window.ENDURO_DATA.site) ? window.ENDURO_DATA.site : null;
    if (!site || !site.heroVideo) return;

    const pick = (obj) => {
      if (typeof obj === 'string') return obj;
      if (!obj || typeof obj !== 'object') return '';
      return obj[lang] || obj.en || obj.hr || '';
    };

    const src = pick(site.heroVideo);
    // const poster = site.heroPoster || '';
    if (!src) return;

    // Clear any fallback markup
    while (mount.firstChild) mount.removeChild(mount.firstChild);

    const vimeoId = getVimeoId(src);
    if (vimeoId){
      const iframe = document.createElement('iframe');
      iframe.src = buildVimeoBackgroundUrl(vimeoId);
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.setAttribute('title', 'Hero video');
      iframe.setAttribute('loading', 'eager');
      mount.appendChild(iframe);
      return;
    }

    // Fallback: local mp4
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    // video.setAttribute('poster', poster);
    const source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    video.appendChild(source);
    mount.appendChild(video);
    try { video.load(); } catch(_) {}
    const startPlayback = () => {
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    if (video.readyState >= 2) startPlayback();
    else video.addEventListener('canplay', startPlayback, { once: true });
  }

  // ----------------------------
  // Footer year
  // ----------------------------
  const yearEl = $('#js-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Render hero background media if present
  initHeroMedia();

  // ----------------------------
  // Mobile nav
  // ----------------------------
  const toggleBtn = $('.nav__toggle') || $('#menuBtn');
  const links = $('#nav-links') || $('#navList') || $('.nav__links');

  function isOpen() {
    return !!(links && links.classList.contains('is-open'));
  }

  function setOpen(open) {
    if (!toggleBtn || !links) return;
    links.classList.toggle('is-open', open);
    // Animate hamburger into an X
    toggleBtn.classList.toggle('is-open', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('no-scroll', open);

    // Keep menu options visually unhighlighted by default when the menu opens.
  }

  if (toggleBtn && links) {
    toggleBtn.addEventListener('click', () => setOpen(!isOpen()));

    // Close on link click (for in-page anchors)
    links.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) setOpen(false);
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) setOpen(false);
    });
  }

  // ----------------------------
  // Same-page anchor handling
  // ----------------------------
  function currentLang(){
    return ((document.documentElement.getAttribute('lang') || document.body.dataset.lang || 'en').toLowerCase().startsWith('hr')) ? 'hr' : 'en';
  }

  function homePathForLang(){
    return '/' + currentLang() + '/';
  }

  function isHomePage(){
    const path = window.location.pathname.replace(/\/index\.html$/i, '/').replace(/\/$/, '');
    return document.body.classList.contains('home') || path === '/' + currentLang();
  }

  function isContactNavLink(a){
    if (!a) return false;
    const href = (a.getAttribute('href') || '').toLowerCase();
    const label = (a.textContent || '').trim().toLowerCase();
    return href.endsWith('#contact') || label === 'contact' || label === 'kontakt';
  }

  function normalizeContactNavLinks(root=document){
    if (isHomePage()) return;
    root.querySelectorAll('.nav__links a, a.nav__link').forEach((a) => {
      if (!isContactNavLink(a)) return;
      a.setAttribute('href', homePathForLang() + '#contact');
      a.dataset.homeContact = 'true';
    });
  }

  // On inner pages, force the menu Contact/Kontakt link to the home contact section.
  // This prevents the injected contact partial on service/gallery pages from being used as the target.
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('.nav__links a, a.nav__link');
    if (!a || isHomePage() || !isContactNavLink(a)) return;
    e.preventDefault();
    if (links && links.classList.contains('is-open')) setOpen(false);
    window.location.assign(homePathForLang() + '#contact');
  }, true);

  function getAnchorId(href){
    if (!href || href === '#') return '';
    if (href.startsWith('#')) return href.slice(1);
    try{
      const url = new URL(href, window.location.origin);
      const samePath = url.pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '');
      if (samePath && url.hash) return url.hash.slice(1);
    }catch(_){}
    return '';
  }

  function bindSamePageAnchors(root=document){
    normalizeContactNavLinks(root);
    root.querySelectorAll('a[href*="#"]').forEach((a) => {
      if (a.dataset.anchorBound === 'true') return;
      a.dataset.anchorBound = 'true';
      a.addEventListener('click', (e) => {
        if (!isHomePage() && isContactNavLink(a)) return;
        const id = getAnchorId(a.getAttribute('href') || '');
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();
        if (links && links.classList.contains('is-open')) setOpen(false);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + id);
      });
    });
  }

  normalizeContactNavLinks();
  bindSamePageAnchors();

  // ----------------------------
  // Active link state
  // ----------------------------
  // Do not highlight any menu item automatically on page load or scroll.
  // A menu item gets highlighted only after the user clicks an in-page nav link.
  function clearActiveNav(){
    document.querySelectorAll('.nav__links a').forEach((a) => a.classList.remove('is-active'));
  }

  function markClickedNavLink(a){
    clearActiveNav();
    // Do not keep any menu option highlighted after click.
    // Browser :active/:hover still gives immediate click feedback.
  }

  if (links) {
    links.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      markClickedNavLink(a);
      setOpen(false);
    });
  }

  clearActiveNav();

  document.addEventListener('enduro:includes:done', () => {
    bindSamePageAnchors();
    clearActiveNav();
    const hashId = window.location.hash ? window.location.hash.slice(1) : '';
    if (hashId) {
      const target = document.getElementById(hashId);
      if (target) setTimeout(() => {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 50);
    }
  });

  // ----------------------------
  // Scroll reveal (soft, modern)
  // ----------------------------
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = [
    ...$$('.section'),
    ...$$('.card'),
    ...$$('.project'),
    ...$$('.thumb'),
    ...$$('.frameLink'),
    ...$$('.tiles > a, .tilegrid > a, .thumb-grid > a')
  ].filter((el, i, arr) => el && arr.indexOf(el) === i);

  // Add base class + simple stagger within a common parent
  revealEls.forEach((el) => {
    el.classList.add('reveal');
  });

  if (revealEls.length) {
    if (reduceMotion) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
      const ioReveal = new IntersectionObserver(
        (entries) => {
          entries.forEach((ent) => {
            if (!ent.isIntersecting) return;
            const el = ent.target;

            // Stagger items that share a grid parent
            const parent = el.parentElement;
            if (parent) {
              const siblings = Array.from(parent.children).filter((n) => n.classList && n.classList.contains('reveal'));
              const idx = siblings.indexOf(el);
              if (idx >= 0) el.style.transitionDelay = `${Math.min(idx * 60, 240)}ms`;
            }

            el.classList.add('is-visible');
            ioReveal.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
      );

      revealEls.forEach((el) => ioReveal.observe(el));
    }
  }

  // ----------------------------
  // Cookie preferences (modal)
  // Goals for this site:
  // - reCAPTCHA is ALWAYS enabled (spam protection)
  // - "Preference cookies" are OPTIONAL (remember cookie choices)
  // If preference cookies are rejected, the modal will be shown again
  // on the next page load because nothing is stored.
  // ----------------------------
  function initCookiePrefs(){
    // Prevent double-init if the async footer include fires later.
    if (window.__ENDURO_COOKIES_INIT) return;
    const PREF_COOKIE = 'enduro_prefs';
    const PREF_LS = 'enduro_cookie_prefs_v5';

    const banner = $('#cookie') || $('#cookieBanner') || document.querySelector('[data-cookie]');
    if (!banner) return; // Will retry after includes are injected.
    window.__ENDURO_COOKIES_INIT = true;

    const btnAccept = (banner.querySelector('[data-cookie-accept]') || $('#cookie-accept') || $('#cookieAccept')) || null;
    const btnReject = banner.querySelector('[data-cookie-reject]');
    const btnSettings = banner.querySelector('[data-cookie-settings]');
    const btnSave = banner.querySelector('[data-cookie-save]');
    const panel = banner.querySelector('[data-cookie-panel]');
    const backdrop = (banner.querySelector('[data-cookie-close]') || banner.querySelector('.cookie__backdrop'));

  function setCookie(name, value, days) {
    try {
      const maxAge = days * 24 * 60 * 60;
      document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
    } catch {
      /* ignore */
    }
  }

  function getCookie(name) {
    try {
      const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : '';
    } catch {
      return '';
    }
  }

  // Session-only choice (used when preference cookies are rejected)
  let sessionPrefs = null;

  function readPrefs() {
    const raw = getCookie(PREF_COOKIE) || (() => {
      try { return localStorage.getItem(PREF_LS) || ''; } catch { return ''; }
    })();
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw);
      if (!obj || typeof obj !== 'object') return null;
      // Version bump: require v5 so old cookies won't suppress the modal.
      if (obj.v !== 5) return null;
      return { v: 5, remember: !!obj.remember };
    } catch {
      return null;
    }
  }

  function clearStoredPrefs(){
    try { setCookie(PREF_COOKIE, '', -1); } catch(e){}
    try { localStorage.removeItem(PREF_LS); } catch(e){}
  }

  function writePrefs(prefs){
    const safe = { v: 5, remember: !!prefs.remember, ts: Date.now() };
    sessionPrefs = safe;
    if (safe.remember){
      const str = JSON.stringify(safe);
      setCookie(PREF_COOKIE, str, 180);
      try { localStorage.setItem(PREF_LS, str); } catch { /* ignore */ }
    } else {
      clearStoredPrefs();
    }
    document.dispatchEvent(new CustomEvent('enduro:cookiePrefs', { detail: safe }));
  }

  function showCookieModal(show) {
    banner.hidden = !show;
    document.documentElement.classList.toggle('no-scroll', show);
    if (show) {
      try { (btnAccept || banner.querySelector('button')).focus({ preventScroll: true }); } catch (e) {}
    }
  }

  function applyPrefs(prefs){
    if (!prefs) return;
    // Only one user-controllable toggle now: remember
    const rememberCb = banner.querySelector('input[data-cookie-toggle="remember"]');
    if (rememberCb) rememberCb.checked = !!prefs.remember;
  }

    const existing = readPrefs();
    if (!existing) showCookieModal(true);
    else { showCookieModal(false); applyPrefs(existing); }

    // Manage panel
    function togglePanel(open) {
      if (!panel) return;
      panel.hidden = !open;
      banner.classList.toggle('is-managing', open);
      if (open) {
        try { panel.querySelector('input[data-cookie-toggle]')?.focus({ preventScroll: true }); } catch (e) {}
      }
    }

    btnSettings && btnSettings.addEventListener('click', () => togglePanel(!!panel && panel.hidden));

    // If user explicitly rejects cookies, we block the page as requested.
    function ensureCookieGate() {
      let gate = document.getElementById('cookieGate');
      if (gate) return gate;
      gate = document.createElement('div');
      gate.id = 'cookieGate';
      gate.className = 'cookieGate';
      gate.hidden = true;
      gate.innerHTML = `
        <div class="cookieGate__inner" role="dialog" aria-modal="true" aria-label="Cookies required">
          <h3 class="cookieGate__title">Cookies required</h3>
          <p class="cookieGate__text">To use this website, cookies must be accepted. You can change your choice at any time.</p>
          <div class="cookieGate__actions">
            <button class="btn btn--primary" type="button" data-cookie-gate-review>Review cookie options</button>
          </div>
        </div>`;
      document.body.appendChild(gate);
      gate.addEventListener('click', (e) => {
        if (e.target.matches('[data-cookie-gate-review]')) {
          e.preventDefault();
          // Hide the gate first so the preferences modal is actually visible.
          hideCookieGate();
          showCookieModal(true);
          togglePanel(true);
        }
      });
      return gate;
    }

    function showCookieGate() {
      const gate = ensureCookieGate();
      gate.hidden = false;
      document.documentElement.classList.add('is-locked');
    }

    function hideCookieGate() {
      const gate = document.getElementById('cookieGate');
      if (gate) gate.hidden = true;
      document.documentElement.classList.remove('is-locked');
    }

    // Accept: enable preference cookie storage
    btnAccept && btnAccept.addEventListener('click', () => {
      writePrefs({ remember: true });
      applyPrefs(sessionPrefs);
      showCookieModal(false);
      togglePanel(false);
      hideCookieGate();
    });

    // Reject: do NOT store any preference cookies
    btnReject && btnReject.addEventListener('click', () => {
      writePrefs({ remember: false });
      showCookieModal(false);
      togglePanel(false);
      // Explicit reject blocks access.
      showCookieGate();
    });

    // Save custom (remember toggle only)
    btnSave && btnSave.addEventListener('click', () => {
      const remember = !!banner.querySelector('input[data-cookie-toggle="remember"]')?.checked;
      writePrefs({ remember });
      applyPrefs(sessionPrefs);
      showCookieModal(false);
      togglePanel(false);
      hideCookieGate();
    });

    // Close on backdrop (only after user has made a choice in this session)
    backdrop && backdrop.addEventListener('click', () => {
      if (readPrefs() || sessionPrefs) showCookieModal(false);
    });

    // Allow opening cookie settings from anywhere
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cookie-open]');
      if (!btn) return;
      e.preventDefault();
      showCookieModal(true);
      togglePanel(true);
    });
  }
  // Run now (for pages where cookie markup is in the HTML)
  initCookiePrefs();
  // Run again after async footer/contact partials are injected
  document.addEventListener('enduro:includes:done', initCookiePrefs);

})();
