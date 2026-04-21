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

// ── Notify form (launch waitlist — Formspree) ────────────────────────────────
// The form POSTs directly to Formspree via its action attribute.
// This JS layer adds:
//   1. Client-side email validation with inline error state
//   2. Loading state on the button during submission
//   3. In-page success state so the page doesn't hard-redirect
const notifyForm = document.querySelector('.notify-form');
if (notifyForm) {
  notifyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = notifyForm.querySelector('.notify-input');
    const btn   = notifyForm.querySelector('button[type="submit"]');
    const email = input.value.trim();

    // Client-side validation
    if (!email || !email.includes('@')) {
      input.style.borderColor = '#FF3B5C';
      setTimeout(() => input.style.borderColor = '', 1500);
      return;
    }

    // Loading state
    const originalLabel = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(notifyForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(notifyForm),
      });

      if (res.ok) {
        // Success
        btn.textContent = "You're on the list ✓";
        btn.style.background = '#4CD98A';
        input.value = '';
        input.disabled = true;
      } else {
        // Formspree returned an error — re-enable so they can retry
        btn.textContent = originalLabel;
        btn.disabled = false;
        input.style.borderColor = '#FF3B5C';
        setTimeout(() => input.style.borderColor = '', 2000);
      }
    } catch (_) {
      // Network failure — re-enable
      btn.textContent = originalLabel;
      btn.disabled = false;
    }
  });

  // Show success message if Formspree redirected back with ?joined=1
  if (new URLSearchParams(window.location.search).get('joined') === '1') {
    const btn   = notifyForm.querySelector('button[type="submit"]');
    const input = notifyForm.querySelector('.notify-input');
    btn.textContent = "You're on the list ✓";
    btn.style.background = '#4CD98A';
    btn.disabled = true;
    input.disabled = true;
  }
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
