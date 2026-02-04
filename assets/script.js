document.addEventListener('DOMContentLoaded', () => {
  const prefersDark = localStorage.getItem('theme') === 'dark';
  if (prefersDark) document.body.classList.add('theme-dark');
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('theme-dark');
      const isDark = document.body.classList.contains('theme-dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
    themeToggle.textContent = document.body.classList.contains('theme-dark') ? '☀️' : '🌙';
  }

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const items = document.querySelectorAll('.accordion-item');
  items.forEach(item => {
    const btn = item.querySelector('.accordion-btn');
    btn.addEventListener('click', () => {
      const open = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });

  const track = document.querySelector('.carousel-track');
  const btnPrev = document.querySelector('.carousel-btn.prev');
  const btnNext = document.querySelector('.carousel-btn.next');
  if (track && btnPrev && btnNext) {
    const exts = ['jpg','jpeg','png','webp'];
    const max = 200;
    const sources = [];
    const probe = src => new Promise(res => {
      const img = new Image();
      img.onload = () => res(true);
      img.onerror = () => res(false);
      img.src = src;
    });
    (async () => {
      let list = [];
      try {
        const r = await fetch('assets/portfolio/index.json', { cache: 'no-store' });
        if (r.ok) {
          const arr = await r.json();
          if (Array.isArray(arr) && arr.length) list = arr.map(n => `assets/portfolio/${n}`);
        }
      } catch {}
      if (!list.length) {
        for (let i = 1; i <= max; i++) {
          let found = false;
          for (const ext of exts) {
            const src = `assets/portfolio/${i}.${ext}`;
            if (await probe(src)) { list.push(src); found = true; break; }
          }
          if (!found) continue;
        }
      }
      if (!list.length) return;
      list.forEach(src => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.style.backgroundImage = `url('${src}')`;
        track.appendChild(slide);
        sources.push(src);
      });
      let index = 0;
      const update = () => {
        track.style.transform = `translateX(-${index * 100}%)`;
      };
      btnPrev.addEventListener('click', () => {
        index = (index - 1 + sources.length) % sources.length;
        update();
      });
      btnNext.addEventListener('click', () => {
        index = (index + 1) % sources.length;
        update();
      });
      window.addEventListener('resize', update);
      let sx = 0, dx = 0;
      track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; dx = 0; }, { passive: true });
      track.addEventListener('touchmove', e => { dx = e.touches[0].clientX - sx; }, { passive: true });
      track.addEventListener('touchend', () => {
        if (Math.abs(dx) > 40) {
          if (dx < 0) btnNext.click(); else btnPrev.click();
        }
      });
      update();
    })();
  }

  const form = document.getElementById('feedback-form');
  const msg = document.getElementById('form-msg');
  const phoneInput = document.getElementById('phone');

  phoneInput.addEventListener('input', () => {
    const v = phoneInput.value.replace(/[^\d+()-\s]/g, '');
    phoneInput.value = v;
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    if (!name || !phone) {
      msg.textContent = 'Заполните имя и телефон.';
      msg.style.color = 'crimson';
      return;
    }
    msg.textContent = 'Заявка отправлена. Мы свяжемся с вами.';
    msg.style.color = 'seagreen';
    form.reset();
  });
});
