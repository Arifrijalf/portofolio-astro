import { createIcons, icons } from 'lucide';

const MIN_SUBMIT_INTERVAL = 5000;
const CV_PATH = '/ArifRijalFadhilah_CV.pdf';

function init() {
  document.documentElement.classList.add('js-anim');
  initIcons();
  initCursor();
  initReveal();
  initNav();
  initNavTilt();
  initBoot();
  initContactForm();
  initDownloadCv();
  initTypewriter();
}

function initIcons() {
  createIcons({ icons });
}

function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;
  document.documentElement.classList.add('has-cursor');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  const loop = () => {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
    requestAnimationFrame(loop);
  };
  loop();
}

function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el, i) => {
    const explicit = el.dataset.revealDelay;
    const idx = explicit ? parseInt(explicit, 10) : Math.min(i, 5);
    el.style.setProperty('--reveal-delay', `${idx * 80}ms`);
    io.observe(el);
  });
}

function initNav() {
  const nav = document.getElementById('main-nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileMenu();
    });
  });

  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const openIcon = document.getElementById('menu-open');
  const closeIcon = document.getElementById('menu-close');
  btn?.addEventListener('click', () => {
    const open = menu?.classList.toggle('is-open');
    if (menu) menu.style.maxHeight = open ? menu.scrollHeight + 'px' : '0';
    if (openIcon) openIcon.classList.toggle('hidden', !!open);
    if (closeIcon) closeIcon.classList.toggle('hidden', !open);
    btn.setAttribute('aria-expanded', String(open));
  });
}

function initNavTilt() {
  const fine = window.matchMedia('(pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;
  document.querySelectorAll('[data-nav]').forEach((el) => {
    let rx = 0, ry = 0, tx = 0, ty = 0;
    let raf = 0;
    const lerp = () => {
      rx += (tx - rx) * 0.15;
      ry += (ty - ry) * 0.15;
      el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
      if (Math.abs(tx - rx) > 0.01 || Math.abs(ty - ry) > 0.01) {
        raf = requestAnimationFrame(lerp);
      } else {
        raf = 0;
      }
    };
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      ty = -y * 8;
      tx = x * 8;
      if (!raf) raf = requestAnimationFrame(lerp);
    });
    el.addEventListener('mouseleave', () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(lerp);
    });
  });
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('mobile-menu-btn');
  if (menu) menu.classList.remove('is-open');
  if (menu) menu.style.maxHeight = '0';
  const openIcon = document.getElementById('menu-open');
  const closeIcon = document.getElementById('menu-close');
  if (openIcon) openIcon.classList.remove('hidden');
  if (closeIcon) closeIcon.classList.add('hidden');
  btn?.setAttribute('aria-expanded', 'false');
}

function initBoot() {
  const screen = document.getElementById('boot-screen');
  const percentEl = document.getElementById('boot-percent');
  const fillEl = document.getElementById('boot-fill');
  const progressText = document.getElementById('boot-progress');
  if (!screen || !percentEl || !fillEl || !progressText) return;

  let interval: number | undefined;
  const skip = () => {
    if (interval) clearInterval(interval);
    percentEl.textContent = '100%';
    fillEl.style.width = '100%';
    screen.classList.add('boot-done');
    setTimeout(() => screen.remove(), 900);
  };

  const sessionSkipped = sessionStorage.getItem('boot-skipped') === '1';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (sessionSkipped || reduced) {
    skip();
    return;
  }

  progressText.textContent = 'BOOT/INITIALIZING';

  let percent = 0;
  interval = setInterval(() => {
    percent += Math.floor(Math.random() * 10) + 5;
    if (percent >= 100) {
      percent = 100;
      clearInterval(interval);
      percentEl.textContent = '100%';
      fillEl.style.width = '100%';
      sessionStorage.setItem('boot-skipped', '1');
      screen.classList.add('boot-done');
      setTimeout(() => screen.remove(), 900);
    } else {
      percentEl.textContent = percent + '%';
      fillEl.style.width = percent + '%';
    }
  }, 90);
  setTimeout(skip, 4000);
}

async function initContactForm() {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn?.querySelector('.btn-text');
  if (!form || !status || !submitBtn) return;

  let lastSubmit = 0;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSubmit < MIN_SUBMIT_INTERVAL) {
      status.textContent = 'Please wait a moment before sending again.';
      status.className = 'form-status error';
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get('name') || '');
    const message = String(formData.get('message') || '');
    if (name.trim().length < 3 || message.trim().length < 20) {
      status.textContent = 'Name must be at least 3 characters and message at least 20.';
      status.className = 'form-status error';
      return;
    }

    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Transmitting...';
    status.textContent = '';
    status.className = 'form-status';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      if (response.ok) {
        lastSubmit = now;
        status.textContent =
          'Message transmitted successfully. I will respond shortly.';
        status.className = 'form-status success';
        form.reset();
      } else {
        throw new Error('Bad response');
      }
    } catch {
      status.textContent =
        'Transmission failed. Please try again or contact me directly via email.';
      status.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Send Message ';
    }
  });
}

function initDownloadCv() {
  const btn = document.getElementById('download-cv-btn');
  btn?.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(CV_PATH, { method: 'HEAD' });
      if (res.ok && (res.headers.get('content-type') || '').includes('pdf')) {
        window.open(CV_PATH, '_blank');
      } else {
        alert('CV NOT FOUND // CHECK: /ArifRijalFadhilah_CV.pdf');
      }
    } catch {
      alert('CV NOT FOUND // CHECK: /ArifRijalFadhilah_CV.pdf');
    }
  });
}

function initTypewriter() {
  const els = document.querySelectorAll('[data-typewriter]');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => {
      el.textContent = el.dataset.typewriter || '';
      el.classList.add('typewriter-done');
    });
    return;
  }

  els.forEach((el) => {
    const text = el.dataset.typewriter || el.textContent;
    const speed = parseInt(el.dataset.typewriterSpeed || '50', 10);
    const delay = parseInt(el.dataset.typewriterDelay || '0', 10);
    const cursor = el.dataset.typewriterCursor !== 'false';

    el.textContent = '';
    el.style.opacity = '1';

    if (cursor) {
      const cursorEl = document.createElement('span');
      cursorEl.className = 'typewriter-cursor';
      cursorEl.textContent = '_';
      cursorEl.style.animation = 'blink 1s step-end infinite';
      cursorEl.style.marginLeft = '2px';
      el.appendChild(cursorEl);
    }

    let i = 0;
    const type = () => {
      if (i < text.length) {
        if (cursor) {
          el.insertBefore(document.createTextNode(text[i]), el.querySelector('.typewriter-cursor'));
        } else {
          el.textContent += text[i];
        }
        i++;
        setTimeout(type, speed);
      } else if (cursor) {
        const cursorEl = el.querySelector('.typewriter-cursor');
        if (cursorEl) cursorEl.style.animation = 'none';
        cursorEl.textContent = '';
      }
    };

    if (delay > 0) {
      setTimeout(type, delay);
    } else {
      type();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
