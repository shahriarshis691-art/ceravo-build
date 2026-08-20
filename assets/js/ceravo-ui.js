(() => {
  if (window.__CERAVO_UI__) return;
  window.__CERAVO_UI__ = true;

  if (!document.getElementById('ceravo-logo-css')) {
    const logoCss = document.createElement('link');
    logoCss.id = 'ceravo-logo-css';
    logoCss.rel = 'stylesheet';
    logoCss.href = 'assets/css/ceravo-logo.css';
    document.head.appendChild(logoCss);
  }

  const CERAVO_LOGO_SRC = '/assets/ceravo-original-logo.svg';
  const isCeravoBrandLink = (el) => {
    if (!el || el.getAttribute('href') !== 'index.html') return false;
    const label = `${el.getAttribute('aria-label') || ''} ${el.textContent || ''}`.toUpperCase();
    return label.includes('CERAVO') && !label.includes('SHATHI');
  };
  document.querySelectorAll('header.topbar a.brand').forEach((brand) => {
    if (!isCeravoBrandLink(brand)) return;
    const existing = brand.querySelector('img.ceravo-logo-img');
    if (existing) {
      existing.src = CERAVO_LOGO_SRC;
      existing.removeAttribute('srcset');
      return;
    }
    brand.innerHTML = `<img class="ceravo-logo-img" src="${CERAVO_LOGO_SRC}" alt="CERAVO" width="1000" height="420" decoding="async" />`;
    if (!brand.getAttribute('aria-label')) brand.setAttribute('aria-label', 'CERAVO home');
  });
  document.querySelectorAll('.topbar .brand-mark img').forEach((img) => {
    img.classList.add('ceravo-logo-img');
    img.src = CERAVO_LOGO_SRC;
    img.alt = 'CERAVO';
    img.setAttribute('width', '1000');
    img.setAttribute('height', '420');
  });

  if (!document.getElementById('ceravo-perf')) {
    const style = document.createElement('style');
    style.id = 'ceravo-perf';
    style.textContent = 'html,body{overflow-x:clip}';
    document.head.appendChild(style);
  }

  if (!document.querySelector('meta[name="view-transition"]')) {
    const meta = document.createElement('meta');
    meta.name = 'view-transition';
    meta.content = 'same-origin';
    document.head.appendChild(meta);
  }

  if (HTMLScriptElement.supports?.('speculationrules') && !document.querySelector('script[type="speculationrules"]')) {
    const spec = document.createElement('script');
    spec.type = 'speculationrules';
    spec.textContent = JSON.stringify({
      prerender: [{
        where: {
          and: [
            { href_matches: '/*' },
            { not: { href_matches: '/assets/*' } },
            { not: { selector_matches: '[target=_blank]' } }
          ]
        },
        eagerness: 'moderate'
      }]
    });
    document.head.appendChild(spec);
  }

  const menu = document.querySelector('#site-menu');
  const menuButton = document.querySelector('[aria-controls="site-menu"]');

  const setMenuState = (isOpen) => {
    if (!menu || !menuButton) return;
    menu.classList.toggle('is-open', isOpen);
    menu.setAttribute('aria-hidden', String(!isOpen));
    menuButton.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflowY = isOpen ? 'hidden' : '';
  };

  if (menu && menuButton) {
    menuButton.addEventListener('click', () => {
      setMenuState(!menu.classList.contains('is-open'));
    });
    menu.addEventListener('click', (event) => {
      if (event.target === menu) setMenuState(false);
    });
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuState(false);
    });
  }

  const prefetched = new Set();
  const prefetchHref = (href) => {
    if (!href) return;
    let url;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }
    if (url.origin !== window.location.origin) return;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
    if (url.pathname.startsWith('/assets/')) return;
    if (url.hash && url.pathname === window.location.pathname && url.search === window.location.search) return;
    if (prefetched.has(url.href)) return;
    prefetched.add(url.href);
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url.pathname + url.search;
    document.head.appendChild(link);
  };

  document.addEventListener('pointerover', (event) => {
    const anchor = event.target.closest('a[href]');
    if (anchor) prefetchHref(anchor.getAttribute('href'));
  }, { passive: true });

  document.addEventListener('touchstart', (event) => {
    const anchor = event.target.closest('a[href]');
    if (anchor) prefetchHref(anchor.getAttribute('href'));
  }, { passive: true });

  const scheduleIdle = window.requestIdleCallback
    ? (fn) => window.requestIdleCallback(fn, { timeout: 1800 })
    : (fn) => window.setTimeout(fn, 350);

  scheduleIdle(() => {
    ['index.html', 'tiles.html', 'washroom.html', 'bathware.html', 'showroom.html', 'contact.html'].forEach(prefetchHref);
  });
})();
