/*
  forms.js
  Enduro Bike Service contact form UX + validation.
*/

(function(){
  'use strict';

  // ====== CONFIG (replace these) ======
  const CONFIG = window.ENDURO_CONFIG = {
    // Google reCAPTCHA v2 (Checkbox) TEST key so the widget renders out-of-the-box.
    // Replace with your real site key when you create it in Google reCAPTCHA.
    RECAPTCHA_SITE_KEY: '6Lesj-EsAAAAAEkGv6H-RWPLsEV0Wy-U-l99Kk1X',
    APPS_SCRIPT_WEBAPP_URL: 'https://recaptcha-bk.bornadji1108.workers.dev'
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function isConfigured(){
    return CONFIG.APPS_SCRIPT_WEBAPP_URL &&
          CONFIG.APPS_SCRIPT_WEBAPP_URL !== 'REPLACE_ME';
  }

  function setStatus(el, type, msg){
    el.hidden = false;
    el.className = 'form-status ' + type;
    el.textContent = msg;
  }

  function clearStatus(el){
    el.hidden = true;
    el.textContent = '';
  }

  function validEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validPhone(v){
    return /^[0-9+\s-]{6,20}$/.test(v.trim());
  }

  function serialize(form){
    const data = {};
    new FormData(form).forEach((v,k)=>{ data[k] = String(v).trim(); });
    return data;
  }

  // ----- Contact: "other" modal -----
  function initOtherModal(lang){
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
      if (select.value === 'other') {
        open();
      } else {
        otherInput.value = '';
      }
    });

    // Keep required only when visible
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

      const status = form.querySelector('#contactStatus, .form-status');
      if (!status) return;

      clearStatus(status);

      if (!isConfigured()){
        setStatus(status,'warn', lang==='hr'
          ? 'Slanje nije moguće dok se ne postavi Apps Script.'
          : 'Submission is disabled until Apps Script is configured.'
        );
        return;
      }

      const data = serialize(form);

      if (!data.name || !data.surname){
        setStatus(status,'error', lang==='hr'
          ? 'Unesite ime i prezime.'
          : 'Please enter your name and surname.'
        );
        return;
      }

      if (!validEmail(data.email)){
        setStatus(status,'error', lang==='hr'
          ? 'Unesite ispravan email.'
          : 'Please enter a valid email.'
        );
        return;
      }

      if (data.phone && !validPhone(data.phone)){
        setStatus(status,'error', lang==='hr'
          ? 'Unesite ispravan broj telefona.'
          : 'Please enter a valid phone number.'
        );
        return;
      }

      const token = window.grecaptcha
        ? window.grecaptcha.getResponse(
            form.dataset.recaptchaId ? Number(form.dataset.recaptchaId) : undefined
          )
        : '';

      if (!token) {
        setStatus(
          status,
          'error',
          lang === 'hr' ? 'Potvrdite reCAPTCHA.' : 'Please complete reCAPTCHA.'
        );
        return;
      }

      try {
        setStatus(status, 'info', lang === 'hr' ? 'Slanje...' : 'Sending...');

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

        try {
          json = text ? JSON.parse(text) : {};
        } catch (e) {}

        if (!res.ok || json.ok === false) {
          throw new Error(
            json.resend_response?.message ||
            json.resend_response?.error ||
            json.details?.message ||
            json.details ||
            json.error ||
            text ||
            `HTTP ${res.status}`
          );
        }

        setStatus(
          status,
          'success',
          lang === 'hr'
            ? 'Poruka poslana! Javit ćemo se uskoro.'
            : 'Message sent! We’ll get back soon.'
        );

        form.reset();

        if (window.grecaptcha) {
          const widgetId = form.dataset.recaptchaId ? Number(form.dataset.recaptchaId) : undefined;
          if (widgetId !== undefined) window.grecaptcha.reset(widgetId);
        }

        setTimeout(() => {
          window.location.assign(lang === 'hr' ? '/hr/uspjeh/' : '/en/success/');
        }, 600);

      } catch (err) {
        console.error('Contact form error:', err);
        setStatus(
          status,
          'error',
          err && err.message
            ? err.message
            : (
                lang === 'hr'
                  ? 'Greška pri slanju. Pokušajte ponovno.'
                  : 'Failed to send. Please try again.'
              )
        );
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

  

  // Called by the Google reCAPTCHA script when loaded (see api.js?onload=...&render=explicit)
  window.ENDURO_onRecaptchaLoad = function(){
    try{ renderRecaptcha(); }catch(e){}
  };
// ----- public init -----
  document.addEventListener('DOMContentLoaded', ()=>{
    const lang = document.documentElement.lang || 'en';
    initOtherModal(lang);
    initContactForm(lang);

    try{ renderRecaptcha(); }catch(e){}
  });
})();
