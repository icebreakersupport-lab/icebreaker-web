/* ═══════════════════════════════════════════
   Icebreaker – main.js
   Scroll animations, nav, FAQ, notify form
   ═══════════════════════════════════════════ */

// ── Nav scroll state ──────────────────────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile nav ────────────────────────────────────────────────────────────────
const hamburger   = document.querySelector('.hamburger');
const mobileNav   = document.querySelector('.mobile-nav');
const mobileClose = document.querySelector('.mobile-nav__close');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  const closeMenu = () => {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  };
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

// ── Scroll-triggered animations ───────────────────────────────────────────────
const animateEls = document.querySelectorAll('[data-animate]');
if (animateEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animateEls.forEach(el => observer.observe(el));
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all others
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) openItem.classList.remove('open');
    });

    item.classList.toggle('open', !isOpen);
  });
});

// ── Notify form (launch waitlist) ─────────────────────────────────────────────
const notifyForm = document.querySelector('.notify-form');
if (notifyForm) {
  notifyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = notifyForm.querySelector('.notify-input');
    const btn   = notifyForm.querySelector('.btn');
    const email = input.value.trim();

    if (!email || !email.includes('@')) {
      input.style.borderColor = '#FF3B5C';
      setTimeout(() => input.style.borderColor = '', 1500);
      return;
    }

    // ── Replace with your actual waitlist endpoint ─────────────────────────
    // e.g. a Cloudflare Worker, Formspree, or ConvertKit form action
    // fetch('/api/waitlist', { method: 'POST', body: JSON.stringify({ email }) })

    btn.textContent = 'You\'re on the list ✓';
    btn.style.background = '#4CD98A';
    btn.disabled = true;
    input.value = '';
    input.disabled = true;
  });
}

// ── Smooth scroll for anchor links ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
