(() => {
  const hero = document.querySelector('.hero');
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.hero-dot')];
  if (!hero || slides.length < 2) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = slides.length;
  const images = slides.map((slide) => slide.querySelector('.hero-media-img'));
  const wrap = (index) => (index + count) % count;

  let active = 0;
  let animating = false;
  let autoplay = true;
  let inView = true;
  let timer = 0;
  let queued = null;
  let drag = null;
  let suppressClick = false;

  const stopTimer = () => {
    window.clearTimeout(timer);
    timer = 0;
  };

  const preload = (index) => {
    const img = images[wrap(index)];
    if (!img || img.dataset.ready === 'true') return;

    if (img.dataset.src && !img.getAttribute('src')) {
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.src = img.dataset.src;
    }

    const markReady = () => {
      img.dataset.ready = 'true';
    };

    if (typeof img.decode === 'function') {
      img.decode().then(markReady).catch(markReady);
    } else if (!img.complete) {
      img.addEventListener('load', markReady, { once: true });
      img.addEventListener('error', markReady, { once: true });
    } else {
      markReady();
    }
  };

  const syncDots = () => {
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === active);
      dot.setAttribute('aria-current', index === active ? 'true' : 'false');
    });
  };

  const clearInline = (slide) => {
    slide.style.transform = '';
    slide.style.opacity = '';
    slide.style.zIndex = '';
  };

  const imageReady = (index) => {
    const img = images[wrap(index)];
    preload(index);
    if (!img || img.dataset.ready === 'true') return Promise.resolve();
    if (img.complete && img.naturalWidth) {
      img.dataset.ready = 'true';
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const done = () => resolve();
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
      window.setTimeout(done, 360);
    });
  };

  const startTimer = () => {
    stopTimer();
    autoplay = true;
    if (reducedMotion || document.hidden || !inView) return;
    timer = window.setTimeout(() => {
      goTo(active + 1, 1);
    }, 5600);
  };

  const finish = (next) => {
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === next);
      slide.classList.remove('is-prepared-left', 'is-prepared-right', 'is-leave-left', 'is-leave-right');
      clearInline(slide);
    });
    active = next;
    animating = false;
    hero.classList.remove('is-animating');
    syncDots();
    preload(active + 1);
    if (queued) {
      const nextMove = queued;
      queued = null;
      goTo(nextMove.index, nextMove.direction);
      return;
    }
    if (autoplay) startTimer();
  };

  const goTo = (index, direction = 1) => {
    const next = wrap(index);
    const dir = direction < 0 ? -1 : 1;

    if (next === active) return;
    if (animating) {
      queued = { index: next, direction: dir };
      return;
    }

    animating = true;
    stopTimer();
    preload(next);
    preload(next + dir);

    const play = () => {
      if (reducedMotion) {
        animating = false;
        finish(next);
        return;
      }

      hero.classList.add('is-animating');

      const current = slides[active];
      const incoming = slides[next];

      incoming.classList.remove('is-leave-left', 'is-leave-right');
      incoming.classList.add(dir > 0 ? 'is-prepared-right' : 'is-prepared-left');
      incoming.offsetWidth;
      current.classList.remove('is-active');
      current.classList.add(dir > 0 ? 'is-leave-left' : 'is-leave-right');
      incoming.classList.remove('is-prepared-left', 'is-prepared-right');
      incoming.classList.add('is-active');

      let settled = false;
      const settle = (event) => {
        if (settled) return;
        if (event && event.target !== incoming) return;
        if (event && event.propertyName && event.propertyName !== 'transform' && event.propertyName !== 'opacity') return;
        settled = true;
        incoming.removeEventListener('transitionend', settle);
        finish(next);
      };

      incoming.addEventListener('transitionend', settle);
      window.setTimeout(settle, 1200);
    };

    imageReady(next).then(play);
  };

  const previous = document.querySelector('[data-hero-previous]');
  const nextButton = document.querySelector('[data-hero-next]');

  previous?.addEventListener('click', () => {
    autoplay = true;
    goTo(active - 1, -1);
  });

  nextButton?.addEventListener('click', () => {
    autoplay = true;
    goTo(active + 1, 1);
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.heroDot);
      autoplay = true;
      goTo(index, index > active ? 1 : -1);
    });
  });

  hero.addEventListener('mouseenter', () => {
    autoplay = false;
    stopTimer();
  });
  hero.addEventListener('mouseleave', startTimer);
  hero.addEventListener('focusin', () => {
    autoplay = false;
    stopTimer();
  });
  hero.addEventListener('focusout', (event) => {
    if (!hero.contains(event.relatedTarget)) startTimer();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      autoplay = false;
      stopTimer();
    } else {
      startTimer();
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        inView = entry.isIntersecting;
        if (inView) startTimer();
        else {
          autoplay = false;
          stopTimer();
        }
      });
    }, { threshold: 0.35 });
    observer.observe(hero);
  }

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (event.target.closest('a, button')) return;
    drag = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastT: event.timeStamp,
      vx: 0,
      dx: 0,
      axis: null,
      width: hero.getBoundingClientRect().width || 1
    };
  };

  const onPointerMove = (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (!drag.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      drag.axis = Math.abs(dx) > Math.abs(dy) * 1.1 ? 'x' : 'y';
      if (drag.axis === 'x') {
        hero.classList.add('is-dragging');
        autoplay = false;
        stopTimer();
        if (hero.setPointerCapture) hero.setPointerCapture(event.pointerId);
      }
    }

    if (drag.axis !== 'x') return;
    event.preventDefault();

    const dt = event.timeStamp - drag.lastT || 16;
    drag.vx = (event.clientX - drag.lastX) / dt;
    drag.lastX = event.clientX;
    drag.lastT = event.timeStamp;
    drag.dx = dx;

    const width = drag.width;
    const progress = Math.max(-1, Math.min(1, dx / width));
    const incomingIndex = wrap(active + (dx < 0 ? 1 : -1));
    const current = slides[active];
    const incoming = slides[incomingIndex];
    preload(incomingIndex);

    slides.forEach((slide) => {
      if (slide !== current && slide !== incoming) {
        slide.style.opacity = '0';
        slide.style.transform = 'translate3d(5.5%, 0, 0)';
      }
    });

    current.style.zIndex = '2';
    current.style.transform = `translate3d(${dx}px, 0, 0)`;
    current.style.opacity = String(1 - Math.min(0.42, Math.abs(progress) * 0.42));

    incoming.style.zIndex = '3';
    incoming.style.transform = `translate3d(${dx < 0 ? width + dx : -width + dx}px, 0, 0)`;
    incoming.style.opacity = String(Math.min(1, Math.abs(progress) * 1.2));
  };

  const onPointerUp = (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const { dx, vx, width, axis } = drag;
    drag = null;
    if (hero.releasePointerCapture && hero.hasPointerCapture?.(event.pointerId)) {
      hero.releasePointerCapture(event.pointerId);
    }
    if (axis !== 'x') {
      hero.classList.remove('is-dragging');
      return;
    }

    const distance = Math.abs(dx);
    const shouldAdvance = distance > Math.max(36, width * 0.14) || Math.abs(vx) > 0.42;
    if (shouldAdvance) {
      suppressClick = true;
      window.setTimeout(() => { suppressClick = false; }, 280);
      slides.forEach(clearInline);
      goTo(active + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      hero.classList.remove('is-dragging');
      return;
    }

    const incoming = slides[wrap(active + (dx < 0 ? 1 : -1))];
    incoming.classList.add(dx < 0 ? 'is-prepared-right' : 'is-prepared-left');
    slides.forEach(clearInline);
    incoming.offsetWidth;
    hero.classList.remove('is-dragging');
    incoming.classList.remove('is-prepared-left', 'is-prepared-right');
    startTimer();
  };

  hero.addEventListener('pointerdown', onPointerDown);
  hero.addEventListener('pointermove', onPointerMove, { passive: false });
  hero.addEventListener('pointerup', onPointerUp);
  hero.addEventListener('pointercancel', onPointerUp);
  hero.addEventListener('click', (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  preload(0);
  const warmNext = () => preload(1);
  if ('requestIdleCallback' in window) window.requestIdleCallback(warmNext, { timeout: 700 });
  else window.setTimeout(warmNext, 180);

  syncDots();
  startTimer();
})();
