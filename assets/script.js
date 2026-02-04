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
