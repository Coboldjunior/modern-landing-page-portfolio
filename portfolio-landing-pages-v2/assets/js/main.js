// Shared interactions for all landing pages
const progress = document.querySelector('.progress-line');
const updateProgress = () => {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${pct}%`;
};
updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

document.querySelectorAll('.nav-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const links = btn.closest('header')?.querySelector('.lp-links, .home-links');
    const open = links?.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(Boolean(open)));
  });
});

document.querySelectorAll('[data-scroll-target]').forEach((el) => {
  el.addEventListener('click', () => document.querySelector(el.dataset.scrollTarget)?.scrollIntoView({ behavior: 'smooth' }));
});

document.querySelectorAll('[data-demo-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const toast = form.querySelector('.form-toast, .toast') || document.createElement('div');
    toast.textContent = 'Danke! Das Formular ist als Frontend-Demo validiert worden.';
    if (!toast.parentElement) form.appendChild(toast);
    form.reset();
  });
});

// Animated counters when visible
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = `${Math.floor(target * (0.2 + 0.8 * p))}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = `${target}${suffix}`;
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.4 });
document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

// Fitness tabs
const tabGroups = document.querySelectorAll('[data-tabs]');
tabGroups.forEach((group) => {
  const buttons = group.querySelectorAll('[data-tab]');
  const panels = group.querySelectorAll('[data-panel]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.tab;
      buttons.forEach((b) => b.classList.toggle('active', b === btn));
      panels.forEach((p) => p.classList.toggle('active', p.dataset.panel === id));
    });
  });
});

// Magnetic-ish hover for CTA buttons
window.addEventListener('pointermove', (event) => {
  document.querySelectorAll('.btn').forEach((btn) => {
    const rect = btn.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const distance = Math.hypot(x, y);
    if (distance < 110) btn.style.transform = `translate(${x * 0.035}px, ${y * 0.035}px)`;
    else btn.style.transform = '';
  });
});
