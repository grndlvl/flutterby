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

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const formFields = contactForm.querySelector('.form-fields');
  const successStatus = contactForm.querySelector('.form-success');
  const errorStatus = contactForm.querySelector('.form-error');
  const defaultButtonLabel = submitButton.textContent;

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton.disabled) return;

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    contactForm.setAttribute('aria-busy', 'true');
    contactForm.classList.remove('is-complete');
    errorStatus.hidden = true;
    errorStatus.classList.remove('is-visible');

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
      });

      if (!response.ok) throw new Error(`Form submission failed with status ${response.status}`);

      contactForm.reset();
      formFields.setAttribute('inert', '');
      successStatus.textContent = 'Thank you! Your message was sent. I’ll be in touch soon.';
      successStatus.hidden = false;
      requestAnimationFrame(() => {
        contactForm.classList.add('is-complete');
        successStatus.classList.add('is-visible');
        successStatus.focus();
      });
    } catch (error) {
      console.error(error);
      errorStatus.textContent = 'Sorry, your message could not be sent. Please try again.';
      errorStatus.hidden = false;
      requestAnimationFrame(() => errorStatus.classList.add('is-visible'));
    } finally {
      contactForm.removeAttribute('aria-busy');
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonLabel;
    }
  });
}

// Subtle reveal-on-scroll. Gated behind reduced-motion + JS + IntersectionObserver,
// so content is always visible if any of those are unavailable.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-reveal');

  const revealTargets = document.querySelectorAll(
    '.section-heading, .gallery figure, .service-grid article, .reassurance li, ' +
      '.about-image, .about > div:last-child, .testimonial blockquote, .faq details, ' +
      '.offer > div, .offer picture, .contact > div',
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );

  revealTargets.forEach((el) => {
    el.classList.add('reveal');
    // gentle stagger for items sharing a parent (gallery, service grid, list…)
    const revealedSiblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains('reveal'));
    const index = revealedSiblings.indexOf(el);
    if (index > 0) el.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
    observer.observe(el);
  });
}
