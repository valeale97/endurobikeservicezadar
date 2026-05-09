/*
  Enduro Bike Service gallery renderer

  The gallery page pulls ALL pictures from:
  /js/data.js -> siteData.gallery.items

  To add/reorder/remove pictures, edit only the gallery.items list in data.js.
  Example item:
  { type: 'image', src: '/assets/img/bike16.jpg', alt: 'Bike Photo', position: 'center 30%' }
*/

(function(){
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const root = document.body;
  if (!root || !root.dataset) return;

  const isWorkshopGallery = root.dataset.project === 'workshop-gallery';
  if (!isWorkshopGallery) return;

  const store = window.ENDURO_DATA || window.BKVP_DATA;
  const lang = root.dataset.lang || document.documentElement.lang || (location.pathname.startsWith('/hr/') ? 'hr' : 'en');
  const gallery = store && store.gallery ? store.gallery : null;
  const grid = $('#js-grid') || $('#js-gallery-grid');

  if (!grid) return;

  function localized(value){
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value[lang] || value.en || value.hr || '';
    }
    return value || '';
  }

  function escapeHtml(value){
    return String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function getVimeoId(src){
    if (!src) return '';
    const value = String(src).trim();
    const prefixed = value.match(/^vimeo:(\d+)$/i);
    if (prefixed) return prefixed[1];
    const urlMatch = value.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    return urlMatch ? urlMatch[1] : '';
  }

  function getGalleryItems(){
    const rawItems = gallery && Array.isArray(gallery.items) ? gallery.items : [];

    return rawItems.map((item) => {
      if (!item) return null;

      if (typeof item === 'string') {
        return {
          type: 'image',
          src: item,
          thumb: item,
          alt: 'Bike Photo',
          position: '50% 50%'
        };
      }

      const src = item.src || item.url || '';
      if (!src) return null;

      return {
        type: item.type || (getVimeoId(src) ? 'video' : 'image'),
        src,
        thumb: item.thumb || item.poster || src,
        alt: item.alt || 'Bike Photo',
        position: item.position || item.objectPosition || '50% 50%'
      };
    }).filter(Boolean);
  }

  function renderText(){
    const titleEl = $('#js-category-title') || $('#js-gallery-title') || $('#js-project-title');
    const descEl = $('#js-category-desc') || $('#js-gallery-desc') || $('#js-project-desc');

    if (gallery && titleEl) titleEl.textContent = localized(gallery.title) || titleEl.textContent;
    if (gallery && descEl) {
      const desc = localized(gallery.desc) || descEl.textContent;
      const instagramUrl = gallery.instagramUrl || '';
      const instagramText = localized(gallery.instagramText) || 'Instagram';
      descEl.innerHTML = escapeHtml(desc) + (instagramUrl ? ' <a class="textLink" href="' + escapeHtml(instagramUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(instagramText) + '</a>.' : '');
      descEl.classList.add('justified-text');
    }
  }

  function showEmptyState(message){
    grid.innerHTML = '<div class="emptyState">' + escapeHtml(message) + '</div>';
  }

  renderText();

  if (!store) {
    showEmptyState('Gallery data was not loaded. Check that /js/data.js loads before /js/gallery.js.');
    return;
  }

  const items = getGalleryItems();
  grid.innerHTML = '';
  grid.classList.add('galleryGrid');

  if (!items.length) {
    showEmptyState('Add gallery images in js/data.js inside siteData.gallery.items.');
    return;
  }

  const PAGE_SIZE = 6;
  const SCROLL_STEP_TO_LOAD = 60;
  const BOTTOM_THRESHOLD = 140;
  let renderedCount = 0;
  let isBatchLoading = false;
  let lastLoadScrollY = window.scrollY;

  function createThumb(item, index){
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'thumb';
    button.dataset.index = String(index);
    button.setAttribute('aria-label', (lang === 'hr' ? 'Otvori sliku' : 'Open image') + ' ' + (index + 1));

    if (item.type === 'video') {
      button.innerHTML =
        '<img src="' + escapeHtml(item.thumb || '/assets/img/logo.jpg') + '" alt="' + escapeHtml(item.alt) + '" loading="lazy" decoding="async">' +
        '<span class="badge" aria-hidden="true">VIDEO</span>';
    } else {
      button.innerHTML = '<img src="' + escapeHtml(item.thumb || item.src) + '" alt="' + escapeHtml(item.alt) + '" loading="lazy" decoding="async">';
    }

    const media = $('img', button);
    if (media) media.style.objectPosition = item.position || '50% 50%';
    return button;
  }

  const loader = document.createElement('div');
  loader.className = 'galleryLoader';
  loader.setAttribute('aria-hidden', 'true');
  loader.style.display = 'none';
  loader.innerHTML = '<span></span><span></span><span></span>';
  grid.insertAdjacentElement('afterend', loader);

  function showLoader(){ loader.style.display = 'flex'; }
  function hideLoader(){ loader.style.display = 'none'; }

  function waitForImages(images){
    return new Promise((resolve) => {
      if (!images.length) { resolve(); return; }
      let remaining = images.length;
      let resolved = false;
      const done = () => {
        if (resolved) return;
        remaining -= 1;
        if (remaining <= 0) {
          resolved = true;
          clearTimeout(timer);
          resolve();
        }
      };
      const timer = setTimeout(() => {
        if (resolved) return;
        resolved = true;
        resolve();
      }, 1200);
      images.forEach((img) => {
        if (img.complete) { done(); return; }
        const onDone = () => {
          img.removeEventListener('load', onDone);
          img.removeEventListener('error', onDone);
          done();
        };
        img.addEventListener('load', onDone, { once:true });
        img.addEventListener('error', onDone, { once:true });
      });
    });
  }

  function isNearBottom(){
    return document.documentElement.scrollHeight - (window.scrollY + window.innerHeight) <= BOTTOM_THRESHOLD;
  }

  async function renderNextBatch(){
    if (isBatchLoading || renderedCount >= items.length) return;
    isBatchLoading = true;
    showLoader();

    const startedAt = performance.now();
    const fragment = document.createDocumentFragment();
    const batchImages = [];
    const end = Math.min(renderedCount + PAGE_SIZE, items.length);

    for (let index = renderedCount; index < end; index += 1) {
      const node = createThumb(items[index], index);
      const img = $('img', node);
      if (img) batchImages.push(img);
      fragment.appendChild(node);
    }

    grid.appendChild(fragment);
    renderedCount = end;
    await waitForImages(batchImages);

    const elapsed = performance.now() - startedAt;
    const remainingDelay = Math.max(0, 250 - elapsed);
    if (remainingDelay) await new Promise((resolve) => setTimeout(resolve, remainingDelay));

    hideLoader();
    isBatchLoading = false;
    lastLoadScrollY = window.scrollY;

    if (renderedCount >= items.length) {
      window.removeEventListener('scroll', handleScroll);
      return;
    }

    if (isNearBottom()) renderNextBatch();
  }

  function handleScroll(){
    if (isBatchLoading || renderedCount >= items.length) return;
    const scrolledSinceLastLoad = window.scrollY - lastLoadScrollY;
    if (scrolledSinceLastLoad >= SCROLL_STEP_TO_LOAD || isNearBottom()) renderNextBatch();
  }

  window.addEventListener('scroll', handleScroll, { passive:true });
  renderNextBatch();

  let lightbox = $('#lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML =
      '<div class="lightbox__inner" role="dialog" aria-modal="true" aria-label="Media viewer">' +
        '<div class="lightbox__top">' +
          '<button class="lbBtn" type="button" id="lb-close" aria-label="Close">×</button>' +
          '<div style="display:flex;gap:.5rem">' +
            '<button class="lbBtn" type="button" id="lb-prev" aria-label="Previous">‹</button>' +
            '<button class="lbBtn" type="button" id="lb-next" aria-label="Next">›</button>' +
          '</div>' +
        '</div>' +
        '<div class="lightbox__stage"><div class="lightbox__media" id="lightbox-media"></div></div>' +
        '<div class="lightbox__bottom"><p class="muted" id="lb-caption" style="margin:0"></p><p class="counter muted" id="lb-counter" style="margin:0"></p></div>' +
      '</div>';
    document.body.appendChild(lightbox);
  }

  const lbMedia = $('#lightbox-media', lightbox);
  const lbClose = $('#lb-close', lightbox);
  const lbPrev = $('#lb-prev', lightbox);
  const lbNext = $('#lb-next', lightbox);
  const lbCaption = $('#lb-caption', lightbox);
  const lbCounter = $('#lb-counter', lightbox);
  let current = 0;
  let lastFocused = null;

  function clamp(value, min, max){
    return Math.max(min, Math.min(max, value));
  }

  function buildVimeoEmbedUrl(id){
    const params = new URLSearchParams({
      autoplay: '1',
      title: '0',
      byline: '0',
      portrait: '0',
      playsinline: '1'
    });
    return 'https://player.vimeo.com/video/' + encodeURIComponent(id) + '?' + params.toString();
  }

  function renderLightbox(){
    const item = items[current];
    lbMedia.innerHTML = '';

    if (item.type === 'video') {
      const vimeoId = getVimeoId(item.src);
      if (vimeoId) {
        const iframe = document.createElement('iframe');
        iframe.src = buildVimeoEmbedUrl(vimeoId);
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('title', item.alt || 'Video');
        iframe.loading = 'lazy';
        lbMedia.appendChild(iframe);
      } else {
        const video = document.createElement('video');
        video.controls = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.src = item.src;
        if (item.thumb) video.poster = item.thumb;
        lbMedia.appendChild(video);
      }
    } else {
      const image = document.createElement('img');
      image.src = item.src;
      image.alt = item.alt || '';
      image.style.objectPosition = item.position || '50% 50%';
      lbMedia.appendChild(image);
    }

    if (lbCaption) lbCaption.textContent = item.alt || '';
    if (lbCounter) lbCounter.textContent = (current + 1) + ' / ' + items.length;
  }

  function openAt(index){
    current = clamp(index, 0, items.length - 1);
    lastFocused = document.activeElement;
    renderLightbox();
    lightbox.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('no-scroll');
  }

  function close(){
    lightbox.setAttribute('aria-hidden', 'true');
    lbMedia.innerHTML = '';
    if (lbCaption) lbCaption.textContent = '';
    document.documentElement.classList.remove('no-scroll');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function prev(){
    current = (current - 1 + items.length) % items.length;
    renderLightbox();
  }

  function next(){
    current = (current + 1) % items.length;
    renderLightbox();
  }

  grid.addEventListener('click', (event) => {
    const button = event.target.closest('button.thumb');
    if (!button) return;
    openAt(Number(button.dataset.index || 0));
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener('keydown', (event) => {
    if (lightbox.getAttribute('aria-hidden') === 'true') return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') prev();
    if (event.key === 'ArrowRight') next();
  });

  let startX = 0;
  let startY = 0;
  lightbox.addEventListener('touchstart', (event) => {
    if (lightbox.getAttribute('aria-hidden') === 'true') return;
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  }, { passive:true });

  lightbox.addEventListener('touchend', (event) => {
    if (lightbox.getAttribute('aria-hidden') === 'true') return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    dx > 0 ? prev() : next();
  }, { passive:true });
})();
