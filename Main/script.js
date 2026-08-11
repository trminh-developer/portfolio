document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const siteNav = document.getElementById('site-nav');
  const year = document.getElementById('year');
  const links = [...document.querySelectorAll('.site-nav a')];

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const sections = document.querySelectorAll('main section[id]');
  const setActiveLink = () => {
    const scrollPosition = window.scrollY + 140;
    let activeId = 'home';

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        activeId = section.id;
      }
    });

    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });
  };

  window.addEventListener('scroll', setActiveLink);
  setActiveLink();
});