/*
  forms.js
  Enduro Bike Service contact form UX + validation.
*/

(function(){
  'use strict';

  const CONFIG = window.ENDURO_CONFIG = {
    RECAPTCHA_SITE_KEY: '6Lesj-EsAAAAAEkGv6H-RWPLsEV0Wy-U-l99Kk1X',
    APPS_SCRIPT_WEBAPP_URL: 'https://enduro-bike-service-contact-form.vgwebpages.workers.dev'
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const CALL_HREF = 'tel:+385955372632';
  const CALL_DISPLAY = '+385 95 537 2632';

  function isHr(lang){
    return String(lang || '').toLowerCase().startsWith('hr');
  }

  function escapeHtml(value){
    return String(value ?? '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function waitMinimum(startedAt, minimumMs){
    const elapsed = performance.now() - startedAt;
    if (elapsed < minimumMs) await delay(minimumMs - elapsed);
  }

  function isConfigured(){
    return CONFIG.APPS_SCRIPT_WEBAPP_URL && CONFIG.APPS_SCRIPT_WEBAPP_URL !== 'REPLACE_ME';
  }

  function setStatus(el, type, msg, options = {}){
    if (!el) return;

    const message = escapeHtml(msg);
    el.hidden = false;
    el.className = 'form-status ' + type;

    if (type === 'info') {
      el.innerHTML =
        '<span class="formState formState--loading">' +
          '<span class="formState__dots" aria-hidden="true"><span></span><span></span><span></span></span>' +
          '<span class="formState__text">' + message + '</span>' +
        '</span>';
      return;
    }

    if (type === 'success') {
      el.innerHTML =
        '<span class="formState formState--success">' +
          '<span class="formState__circle" aria-hidden="true">✓</span>' +
          '<span class="formState__text">' + message + '</span>' +
        '</span>';
      return;
    }

    if (type === 'error') {
      const call = options.showCall === false
        ? ''
        : ' <a class="formStatusCall" href="' + CALL_HREF + '">' + CALL_DISPLAY + '</a>';

      el.innerHTML =
        '<span class="formState formState--error">' +
          '<span class="formState__circle" aria-hidden="true">×</span>' +
          '<span class="formState__text">' + message + call + '</span>' +
        '</span>';
      return;
    }

    el.textContent = msg;
  }

  function clearStatus(el){
    if (!el) return;
    el.hidden = true;
    el.textContent = '';
  }

  function validEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validPhone(v){
    return /^[0-9+\s().-]{6,24}$/.test(v.trim());
  }


  function setFieldInvalid(form, name){
    if (!form || !name) return;
    form.querySelectorAll('[aria-invalid="true"]').forEach((el)=>{
      el.removeAttribute('aria-invalid');
    });
    const field = form.querySelector('[name="' + name + '"]');
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      try { field.focus({ preventScroll: false }); } catch (_) { field.focus(); }
    }
  }

  function clearFieldInvalid(form){
    if (!form) return;
    form.querySelectorAll('[aria-invalid="true"]').forEach((el)=>{
      el.removeAttribute('aria-invalid');
    });
  }

  function serialize(form){
    const data = {};
    new FormData(form).forEach((v,k)=>{ data[k] = String(v).trim(); });
    return data;
  }

  // ----- Contact: "other" modal -----
  function initOtherModal(){
    const select = $('#inquiry');
    const modal = $('#otherModal');
    const otherInput = $('#otherDetails');
    if (!select || !modal || !otherInput) return;

    const open = () => {
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      otherInput.focus();
    };

    const close = () => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      if (select) select.focus();
    };

    $('#otherClose')?.addEventListener('click', close);
    modal.addEventListener('click', (e)=>{
      if (e.target === modal) close();
    });

    document.addEventListener('keydown', (e)=>{
      if (!modal.hidden && e.key === 'Escape') close();
    });

    select.addEventListener('change', ()=>{
      if (select.value === 'other') open();
      else otherInput.value = '';
    });

    const observer = new MutationObserver(()=>{
      otherInput.required = select.value === 'other';
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['hidden'] });
  }

  async function initContactForm(lang){
    document.addEventListener('submit', async (e) => {
      const form = e.target.closest('form[data-form="contact"]');
      if (!form) return;

      e.preventDefault();

      const hr = isHr(lang);
      const status = form.querySelector('#contactStatus, .form-status');
      const submitBtn = form.querySelector('button[type="submit"]');
      if (!status) return;

      clearStatus(status);

      if (!isConfigured()){
        setStatus(status, 'error', hr
          ? 'Slanje trenutno nije moguće. Pokušajte ponovno ili nazovite.'
          : 'Sending is currently unavailable. Please try again or give us a call.'
        );
        return;
      }

      const data = serialize(form);
      clearFieldInvalid(form);

      const chronologicalChecks = [
        { name: 'name', invalid: !data.name, message: hr ? 'Unesite ime.' : 'Please enter your name.' },
        { name: 'surname', invalid: !data.surname, message: hr ? 'Unesite prezime.' : 'Please enter your surname.' },
        { name: 'phone', invalid: !data.phone, message: hr ? 'Unesite broj telefona.' : 'Please enter your phone number.' },
        { name: 'phone', invalid: !!data.phone && !validPhone(data.phone), message: hr ? 'Unesite ispravan broj telefona.' : 'Please enter a valid phone number.' },
        { name: 'email', invalid: !data.email, message: hr ? 'Unesite email.' : 'Please enter your email.' },
        { name: 'email', invalid: !!data.email && !validEmail(data.email), message: hr ? 'Unesite ispravan email.' : 'Please enter a valid email.' },
        { name: 'country', invalid: !data.country, message: hr ? 'Unesite državu.' : 'Please enter your country.' },
        { name: 'need', invalid: !data.need, message: hr ? 'Odaberite kategoriju usluge.' : 'Please choose a service category.' },
        { name: 'message', invalid: !data.message, message: hr ? 'Unesite poruku.' : 'Please enter your message.' }
      ];

      const firstProblem = chronologicalChecks.find(item => item.invalid);
      if (firstProblem) {
        setFieldInvalid(form, firstProblem.name);
        setStatus(status, 'error', firstProblem.message, { showCall:false });
        return;
      }

      const token = window.grecaptcha
        ? window.grecaptcha.getResponse(
            form.dataset.recaptchaId ? Number(form.dataset.recaptchaId) : undefined
          )
        : '';

      if (!token) {
        setStatus(status, 'error', hr ? 'Potvrdite reCAPTCHA.' : 'Please complete reCAPTCHA.', { showCall:false });
        return;
      }

      const startedAt = performance.now();
      if (submitBtn) submitBtn.disabled = true;
      setStatus(status, 'info', hr ? 'Slanje poruke...' : 'Sending message...');

      try {
        const res = await fetch(CONFIG.APPS_SCRIPT_WEBAPP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'send',
            payload: data,
            recaptchaToken: token
          })
        });

        const text = await res.text();
        let json = {};

        try { json = text ? JSON.parse(text) : {}; } catch (_) {}

        if (!res.ok || json.ok === false) {
          throw new Error(json.error || text || `HTTP ${res.status}`);
        }

        await waitMinimum(startedAt, 2000);

        setStatus(status, 'success', hr
          ? 'Poruka je uspješno poslana. Javit ćemo vam se u najkraćem mogućem roku.'
          : 'Message sent successfully. We will get back to you as soon as possible.'
        );

        form.reset();
        clearFieldInvalid(form);

        if (window.grecaptcha) {
          const widgetId = form.dataset.recaptchaId ? Number(form.dataset.recaptchaId) : undefined;
          if (widgetId !== undefined) window.grecaptcha.reset(widgetId);
        }
      } catch (err) {
        console.error('Contact form error:', err);
        await waitMinimum(startedAt, 2000);
        setStatus(status, 'error', hr
          ? 'Došlo je do problema pri slanju. Pokušajte ponovno ili nas nazovite.'
          : 'There was a problem sending the message. Please try again or give us a call.'
        );
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  function getSiteKey(){
    const meta = document.querySelector('meta[name="recaptcha-site-key"]');
    const m = meta && meta.content ? meta.content.trim() : '';
    if (m && m !== 'RECAPTCHA_SITE_KEY' && m !== 'REPLACE_ME') return m;

    const c = CONFIG && CONFIG.RECAPTCHA_SITE_KEY ? String(CONFIG.RECAPTCHA_SITE_KEY).trim() : '';
    if (c && c !== 'RECAPTCHA_SITE_KEY' && c !== 'REPLACE_ME') return c;

    return '';
  }

  function renderRecaptcha(){
    if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') {
      console.error('grecaptcha.render is unavailable');
      return;
    }

    const sitekey = getSiteKey();
    if (!sitekey) return;

    document.querySelectorAll('[data-recaptcha]:not(.js-recaptcha)').forEach((el)=>{
      el.classList.add('js-recaptcha');
    });

    document.querySelectorAll('.js-recaptcha').forEach((el)=>{
      if (el.dataset.rendered === 'true') return;
      try{
        const id = window.grecaptcha.render(el, { sitekey });
        el.dataset.rendered = 'true';
        const form = el.closest('form');
        if (form) form.dataset.recaptchaId = String(id);
      }catch(e){
        console.error('reCAPTCHA render failed:', e);
      }
    });
  }

  window.ENDURO_onRecaptchaLoad = function(){
    try{ renderRecaptcha(); }catch(e){}
  };

  document.addEventListener('input', (e)=>{
    const field = e.target && e.target.closest ? e.target.closest('input, select, textarea') : null;
    if (field && field.hasAttribute('aria-invalid')) field.removeAttribute('aria-invalid');
  });

  document.addEventListener('change', (e)=>{
    const field = e.target && e.target.closest ? e.target.closest('input, select, textarea') : null;
    if (field && field.hasAttribute('aria-invalid')) field.removeAttribute('aria-invalid');
  });

  document.addEventListener('DOMContentLoaded', ()=>{
    const lang = document.documentElement.lang || document.body.dataset.lang || 'en';
    initOtherModal(lang);
    initContactForm(lang);
    try{ renderRecaptcha(); }catch(e){}
  });
})();
