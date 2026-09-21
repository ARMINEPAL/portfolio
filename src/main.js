import './style.css'

const themeButton = document.querySelector('.theme_btn')
const body = document.body

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark_theme');
  themeButton.textContent = '☀️';
}

themeButton.addEventListener('click', () => {
  body.classList.toggle('dark_theme');

  if (body.classList.contains('dark_theme')) {
    themeButton.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  } else {
    themeButton.textContent = '🌙';
    localStorage.removeItem('theme')
  }
});

const menuButton = document.querySelector('.menu_btn');
const menu = document.querySelector('.header_nav');
menuButton.addEventListener('click', () => {
  menu.classList.toggle('menu_open');
});

const menuLinks = document.querySelectorAll('.header_link');

menuLinks.forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('menu_open');
  });
});

const filterButtons = document.querySelectorAll('.filter_btn');
const projects = document.querySelectorAll('.project');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;


    filterButtons.forEach((button) => {
      button.classList.remove('active');
    });

    button.classList.add('active');

    projects.forEach((project) => {
      if (filter === 'all' || project.dataset.category === filter) {
        project.style.display = 'flex';
      } else {
        project.style.display = 'none';
      }
    });
  });
});

const modal = document.querySelector('.modal');
const modalImage = document.querySelector('.modal_image');

const demoButtons = document.querySelectorAll('.demo_btn');

demoButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const project = button.closest('.project');
    const image = project.dataset.image;

    modalImage.src = image;
    modal.style.display = 'flex';
  });
});

const modalClose = document.querySelector('.modal_close');
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});