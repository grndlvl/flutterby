const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');
const menuLabel = menuButton.querySelector('.sr-only');
const menuText = menuButton.querySelector('[aria-hidden]');

const closeMenu = (returnFocus = false) => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuLabel.textContent = 'Open menu';
  menuText.textContent = 'Menu';
  nav.classList.remove('is-open');
  if (returnFocus) menuButton.focus();
};

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuLabel.textContent = isOpen ? 'Open menu' : 'Close menu';
  menuText.textContent = isOpen ? 'Menu' : 'Close';
  nav.classList.toggle('is-open', !isOpen);
});

nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    closeMenu();
    requestAnimationFrame(() => menuButton.focus());
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu(true);
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
