(function () {
  'use strict';

  const store = window.ENDURO_DATA || {};
  const site = store.site || {};
  const services = store.services || {};
  const projects = store.projects || {};
  const domain = (site.domain || '').replace(/\/$/, '');
  const brand = site.brand || 'Enduro Bike Service';
  const tabTitle = 'Enduro Bike Service Zadar';
  const socialImage = ((site.assets && site.assets.socialImage) || '/assets/img/profile.png');
  const logo = ((site.assets && site.assets.logo) || '/assets/img/logo.svg');

  function getLang() {
    const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (htmlLang.startsWith('hr')) return 'hr';
    if (htmlLang.startsWith('en')) return 'en';
    return location.pathname.startsWith('/hr/') ? 'hr' : 'en';
  }

  function pickLocalized(value, lang, fallback = '') {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value[lang] || value.en || value.hr || fallback;
    }
    return value || fallback;
  }

  function normalizePath(pathname) {
    if (!pathname) return '/';
    if (pathname === '/') return '/';
    if (/\.[a-z0-9]+$/i.test(pathname)) return pathname;
    return pathname.endsWith('/') ? pathname : pathname + '/';
  }

  function absoluteUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return domain + path;
  }

  function findServiceEntry(pathname, lang) {
    const normalized = normalizePath(pathname);
    return Object.values(services).find((item) => item && normalizePath(pickLocalized(item.path, lang, '')) === normalized);
  }

  function findProjectEntry(pathname, lang) {
    const normalized = normalizePath(pathname);
    return Object.values(projects).find((item) => item && normalizePath(pickLocalized(item.path, lang, '')) === normalized);
  }

  function buildHomeSeo(lang) {
    const cfg = (site.seo && site.seo.home) || {};
    const path = pickLocalized(cfg.path, lang, lang === 'hr' ? '/hr/' : '/en/');
    return {
      title: pickLocalized(cfg.title, lang, brand),
      description: pickLocalized(cfg.description, lang, ''),
      ogTitle: pickLocalized(cfg.ogTitle || cfg.title, lang, brand),
      ogDescription: pickLocalized(cfg.ogDescription || cfg.description, lang, ''),
      canonicalPath: path,
      alternates: cfg.path || { en: '/en/', hr: '/hr/' },
      xDefault: cfg.xDefault || '/hr/',
      image: socialImage,
      type: 'website'
    };
  }

  function buildServiceSeo(item, lang) {
    const title = pickLocalized(item.title, lang);
    const description = pickLocalized(item.desc, lang);
    return {
      title: `${title} | ${brand}`,
      description,
      ogTitle: `${title} | ${brand}`,
      ogDescription: description,
      canonicalPath: pickLocalized(item.path, lang, '/'),
      alternates: item.path || {},
      xDefault: (item.path && item.path.en) || pickLocalized(item.path, lang, '/'),
      image: item.cover || socialImage,
      type: 'website'
    };
  }

  function buildProjectSeo(item, lang) {
    const title = pickLocalized(item.title, lang);
    const description = pickLocalized(item.homeDescription || item.description, lang);
    return {
      title: `${title} | ${brand}`,
      description,
      ogTitle: `${title} | ${brand}`,
      ogDescription: description,
      canonicalPath: pickLocalized(item.path, lang, '/'),
      alternates: item.path || {},
      xDefault: (item.path && item.path.en) || pickLocalized(item.path, lang, '/'),
      image: item.cover || item.heroPoster || socialImage,
      type: 'article'
    };
  }

  function buildLegalSeo(key, lang) {
    const cfg = site.seo && site.seo.legal && site.seo.legal[key];
    if (!cfg) return null;
    return {
      title: pickLocalized(cfg.title, lang, brand),
      description: pickLocalized(cfg.description, lang, ''),
      ogTitle: pickLocalized(cfg.title, lang, brand),
      ogDescription: pickLocalized(cfg.description, lang, ''),
      canonicalPath: pickLocalized(cfg.path, lang, '/'),
      alternates: cfg.path || {},
      xDefault: cfg.xDefault || '/hr/',
      image: socialImage,
      type: 'website'
    };
  }

  function resolveSeo(pathname, lang) {
    const normalized = normalizePath(pathname);

    if (normalized === '/en/' || normalized === '/hr/') return buildHomeSeo(lang);

    const serviceItem = findServiceEntry(normalized, lang);
    if (serviceItem) return buildServiceSeo(serviceItem, lang);

    const projectItem = findProjectEntry(normalized, lang);
    if (projectItem) return buildProjectSeo(projectItem, lang);

    if (normalized === '/en/privacy.html' || normalized === '/hr/privacy.html') return buildLegalSeo('privacy', lang);
    if (normalized === '/en/cookies.html' || normalized === '/hr/cookies.html') return buildLegalSeo('cookies', lang);

    return null;
  }

  function upsertMeta(attrName, attrValue, content) {
    if (!content) return;
    let node = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!node) {
      node = document.createElement('meta');
      node.setAttribute(attrName, attrValue);
      document.head.appendChild(node);
    }
    node.setAttribute('content', content);
  }

  function upsertLink(rel, attrs) {
    let selector = `link[rel="${rel}"]`;
    Object.entries(attrs).forEach(([key, value]) => {
      if (key !== 'href') selector += `[${key}="${value}"]`;
    });
    let node = document.head.querySelector(selector);
    if (!node) {
      node = document.createElement('link');
      node.setAttribute('rel', rel);
      document.head.appendChild(node);
    }
    Object.entries(attrs).forEach(([key, value]) => {
      node.setAttribute(key, value);
    });
  }

  function updateJsonLdOrganization() {
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
      try {
        const data = JSON.parse(script.textContent);
        const arr = Array.isArray(data) ? data : [data];
        let changed = false;
        arr.forEach((entry) => {
          if (!entry || typeof entry !== 'object') return;
          if (entry['@type'] === 'Organization' || entry['@type'] === 'LocalBusiness' || entry['@type'] === 'ProfessionalService') {
            if (brand) entry.name = brand;
            if (domain) entry.url = domain + '/';
            if (logo) entry.logo = absoluteUrl(logo);
            entry.telephone = '+385955372632';
            entry.priceRange = '€€';
            entry.foundingDate = '2021';
            changed = true;
          }
          if (entry['@type'] === 'WebSite' && domain) {
            entry.url = domain + '/';
            if (brand) entry.name = brand;
            changed = true;
          }
        });
        if (changed) {
          script.textContent = JSON.stringify(Array.isArray(data) ? arr : arr[0], null, 2);
        }
      } catch (err) {
        // ignore invalid JSON-LD blocks
      }
    });
  }

  function applySeo() {
    if (!document.head || !domain) return;
    const lang = getLang();
    const seo = resolveSeo(location.pathname, lang);
    if (!seo) return;

    document.title = tabTitle;

    upsertMeta('name', 'description', seo.description);
    upsertMeta('property', 'og:type', seo.type || 'website');
    upsertMeta('property', 'og:site_name', brand);
    upsertMeta('property', 'og:title', seo.ogTitle || seo.title);
    upsertMeta('property', 'og:description', seo.ogDescription || seo.description);
    upsertMeta('property', 'og:url', absoluteUrl(seo.canonicalPath));
    upsertMeta('property', 'og:image', absoluteUrl(seo.image || socialImage));
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', seo.ogTitle || seo.title);
    upsertMeta('name', 'twitter:description', seo.ogDescription || seo.description);
    upsertMeta('name', 'twitter:image', absoluteUrl(seo.image || socialImage));

    upsertLink('canonical', { href: absoluteUrl(seo.canonicalPath) });
    if (seo.alternates && seo.alternates.en) upsertLink('alternate', { hreflang: 'en', href: absoluteUrl(seo.alternates.en) });
    if (seo.alternates && seo.alternates.hr) upsertLink('alternate', { hreflang: 'hr', href: absoluteUrl(seo.alternates.hr) });
    upsertLink('alternate', { hreflang: 'x-default', href: absoluteUrl(seo.xDefault || ((seo.alternates && seo.alternates.en) || seo.canonicalPath)) });

    updateJsonLdOrganization();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySeo);
  } else {
    applySeo();
  }
})();
