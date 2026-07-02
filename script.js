const header     = document.getElementById('site-header');
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-link');
const navLinks   = document.querySelectorAll('.main-nav a[href^="#"], .mobile-link');
const sections   = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('.fade-in');

// ── Hamburger ────────────────────────────────────────────
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-open');
    mobileNav.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });
}
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('is-open');
    mobileNav?.classList.remove('is-open');
    hamburger?.setAttribute('aria-expanded', 'false');
    hamburger?.setAttribute('aria-label', 'Abrir menú');
  });
});

// ── Scroll reveal ─────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

revealItems.forEach(item => revealObserver.observe(item));

// ── Active nav link ───────────────────────────────────────
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  });
}, { threshold: 0.45 });

sections.forEach(section => sectionObserver.observe(section));

// ── Header shadow on scroll ───────────────────────────────
window.addEventListener('scroll', () => {
  if (!header) return;
  header.style.boxShadow = window.scrollY > 30
    ? '0 10px 30px rgba(204,29,55,0.08)'
    : 'none';
}, { passive: true });

// ── Portfolio download ────────────────────────────────────
function downloadPortfolio() {
  fetch('./pdf/portfolio.pdf')
    .then(r => {
      if (!r.ok) throw new Error('not found');
      return r.blob();
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Break-Studio-Portfolio.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    })
    .catch(() => {
      alert('Coloca tu portfolio en la carpeta /pdf con el nombre "portfolio.pdf" para activar esta descarga.');
    });
}
// ── Copy email ────────────────────────────────────────
function copyEmail(email, btn) {
  navigator.clipboard.writeText(email).then(() => {
    const toast = btn.querySelector('.copied-toast');
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = email;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    const toast = btn.querySelector('.copied-toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1800);
    }
  });
}
window.copyEmail = copyEmail;
