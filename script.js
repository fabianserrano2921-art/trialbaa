document.addEventListener('DOMContentLoaded', () => {


  /* ===== SCROLL OBSERVER ===== */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.scroll-anim').forEach(el => observer.observe(el));

  /* ===== HEADER SCROLL & ACTIVE NAV ===== */
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('main, section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (header) header.classList.toggle('scrolled', scrollY > 60);
    if (backToTop) backToTop.classList.toggle('visible', scrollY > 400);

    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 220) current = sec.id;
    });

    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  /* ===== MOBILE MENU ===== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  const openMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.style.display = 'flex';
    requestAnimationFrame(() => mobileMenu.classList.add('open'));
    hamburger?.classList.add('active');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    setTimeout(() => {
      if (!mobileMenu.classList.contains('open')) mobileMenu.style.display = 'none';
    }, 300);
    hamburger?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ===== FAQ ACCORDION ===== */
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-toggle').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ===== BACK TO TOP ===== */
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===== CONTACT FORM VALIDATION ===== */
  const form = document.getElementById('contactForm');
  if (form) {
    const fields = {
      nombre:  { el: document.getElementById('nombre'),  err: document.getElementById('error-nombre'),  validate: v => v.trim().length >= 2 },
      email:   { el: document.getElementById('email'),   err: document.getElementById('error-email'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
      mensaje: { el: document.getElementById('mensaje'), err: document.getElementById('error-mensaje'), validate: v => v.trim().length >= 10 }
    };

    const validateField = (key) => {
      const f = fields[key];
      if (!f.el) return true;
      const valid = f.validate(f.el.value);
      f.el.classList.toggle('error', !valid);
      if (f.err) f.err.classList.toggle('show', !valid);
      return valid;
    };

    Object.keys(fields).forEach(key => {
      const field = fields[key].el;
      if (!field) return;
      field.addEventListener('blur', () => validateField(key));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(key);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const allValid = Object.keys(fields).map(validateField).every(Boolean);
      if (!allValid) return;

      const btn = document.getElementById('submitBtn');
      const successMsg = document.getElementById('formSuccess');
      
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Enviando...';
      }

      setTimeout(() => {
        form.reset();
        if (successMsg) successMsg.classList.add('show');
        if (btn) btn.textContent = 'Enviado ✓';
        
        setTimeout(() => {
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Enviar Mensaje';
          }
          if (successMsg) successMsg.classList.remove('show');
        }, 5000);
      }, 1200);
    });
  }

  /* ===== CAROUSEL DOTS ===== */
  const initCarousels = () => {
    if (window.innerWidth > 768) return;
    document.querySelectorAll('.carousel-track').forEach(track => {
      if (track._carouselReady) return;
      track._carouselReady = true;

      const dotsEl = track.parentElement.querySelector('.carousel-dots');
      if (!dotsEl) return;
      const items = Array.from(track.children);
      if (items.length <= 1) return;

      dotsEl.innerHTML = '';
      items.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'c-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
          track.scrollTo({ left: items[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
        });
        dotsEl.appendChild(dot);
      });

      let scrollTimeout;
      track.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const trackLeft = track.getBoundingClientRect().left;
          let best = 0, min = Infinity;
          items.forEach((el, i) => {
            const d = Math.abs(el.getBoundingClientRect().left - trackLeft);
            if (d < min) { min = d; best = i; }
          });
          dotsEl.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('active', i === best));
        }, 50);
      }, { passive: true });
    });
  };

  initCarousels();
  window.addEventListener('resize', initCarousels, { passive: true });
});