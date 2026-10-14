
import './style.css';
import i18n from './i18n/index.js';

//language

const languageButtons = document.querySelectorAll('.lang-btn');
const themeButton = document.querySelector('.theme_btn');
const menuButton = document.querySelector('.menu_btn');
const menu = document.querySelector('.header_nav');

function updateTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = i18n.t(key);
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    element.setAttribute('aria-label', i18n.t(key));
  });

  document.documentElement.lang = i18n.language;

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === i18n.language;

    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  updateMenuLabel();
}

languageButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const language = button.dataset.lang;

    await i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  });
});

i18n.on('languageChanged', updateTranslations);
updateTranslations();

//theme

const body = document.body;
const savedTheme = localStorage.getItem('theme');

function updateThemeButton() {
  const isDark = body.classList.contains('dark_theme');

  themeButton.querySelector('span').textContent = isDark ? '☀️' : '🌙';
  themeButton.setAttribute('aria-pressed', String(isDark));
}

if (savedTheme === 'dark') {
  body.classList.add('dark_theme');
}

updateThemeButton();

themeButton.addEventListener('click', () => {
  body.classList.toggle('dark_theme');

  const isDark = body.classList.contains('dark_theme');

  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  updateThemeButton();
});

//menu

function updateMenuLabel() {
  const isOpen = menu.classList.contains('menu_open');

  menuButton.setAttribute(
    'aria-label',
    i18n.t(isOpen ? 'menu.close' : 'menu.open')
  );

  menuButton.setAttribute('aria-expanded', String(isOpen));

  menuButton.querySelector('span').textContent = isOpen ? '✕' : '☰';
}

function closeMenu() {
  menu.classList.remove('menu_open');
  updateMenuLabel();
}

menuButton.addEventListener('click', () => {
  menu.classList.toggle('menu_open');
  updateMenuLabel();
});

document.querySelectorAll('.header_link').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('click', (event) => {
  if (
    menu.classList.contains('menu_open') &&
    !menu.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    closeMenu();
  }
});

//filters

const filterButtons = document.querySelectorAll('.filter_btn');
const projects = document.querySelectorAll('.project');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;

      filterButton.classList.toggle('active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    });

    projects.forEach((project) => {
      project.hidden =
        filter !== 'all' && project.dataset.category !== filter;
    });
  });
});

//modal

const modal = document.querySelector('.modal');
const modalImage = document.querySelector('.modal_image');
const modalClose = document.querySelector('.modal_close');
const demoButtons = document.querySelectorAll('.demo_btn');

let previousFocusedElement = null;

function openModal(project) {
  const image = project.dataset.image;

  if (!image) return;

  previousFocusedElement = document.activeElement;

  modalImage.src = image;
  modalImage.alt = project.querySelector('.project_title').textContent;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');

  body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  if (!modal.classList.contains('is-open')) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');

  modalImage.removeAttribute('src');
  body.style.overflow = '';

  previousFocusedElement?.focus();
}

demoButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const project = button.closest('.project');
    openModal(project);
  });
});

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
    closeMenu();
  }

  if (
    event.key === 'Tab' &&
    modal.classList.contains('is-open')
  ) {
    event.preventDefault();
    modalClose.focus();
  }
});



const backToTopButton = document.querySelector('.back-to-top');

function updateBackToTop() {
  backToTopButton.hidden = window.scrollY < 400;
}

window.addEventListener('scroll', updateBackToTop, {
  passive: true,
});

updateBackToTop();

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth',
  });
});

//contact

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('.form_status');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = contactForm.elements.name.value.trim();
  const email = contactForm.elements.email.value.trim();
  const message = contactForm.elements.message.value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = i18n.t('form.required');
    return;
  }

  if (!contactForm.elements.email.validity.valid) {
    formStatus.textContent = i18n.t('form.invalidEmail');
    return;
  }

  formStatus.textContent = i18n.t('form.unavailable');
});

i18n.on('languageChanged', () => {
  formStatus.textContent = '';
});
