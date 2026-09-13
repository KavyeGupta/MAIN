'use strict';

///////////////////////////////////////
// Elements selection
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const modalForm = document.querySelector('.modal__form');
const modalContentContainer = document.querySelector('.modal__content-container');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  if (e) e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal?.addEventListener('click', closeModal);
overlay?.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Open Account Form Submission -> Redirects to new app.html page
if (modalForm) {
  modalForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const firstNameInput = document.querySelector('#firstName');
    const lastNameInput = document.querySelector('#lastName');
    const firstName = firstNameInput ? firstNameInput.value.trim() : 'User';
    const lastName = lastNameInput ? lastNameInput.value.trim() : '';
    const fullName = `${firstName} ${lastName}`.trim();

    // Generate username from initials (lowercase)
    let username = (
      (firstName[0] || 'u') + (lastName ? lastName[0] : (firstName[1] || 's'))
    ).toLowerCase();

    // Default demo PIN
    const pin = 1111;

    // Create the user's account with starter balance
    const newAccount = {
      owner: fullName,
      username: username,
      movements: [1000, 450, -100, 300],
      interestRate: 1.2,
      pin: pin,
      type: 'standard',
    };

    // Save to localStorage for app.html to read
    const existingAccounts = JSON.parse(
      localStorage.getItem('bankist_custom_accounts') || '[]'
    );
    const existingIndex = existingAccounts.findIndex(
      acc => acc.username === username
    );

    if (existingIndex !== -1) {
      existingAccounts[existingIndex] = newAccount;
    } else {
      existingAccounts.push(newAccount);
    }

    localStorage.setItem(
      'bankist_custom_accounts',
      JSON.stringify(existingAccounts)
    );

    // Flag for app.html to auto-login this user
    localStorage.setItem('bankist_active_user', username);

    // Show success view inside modal and redirect to app.html
    if (modalContentContainer) {
      modalContentContainer.innerHTML = `
        <h2 class="modal__header" style="margin-bottom: 2rem;">
          🎉 Account <span class="highlight">Created!</span>
        </h2>
        <div style="font-size: 1.6rem; text-align: center; margin-bottom: 2.5rem;">
          <p style="margin-bottom: 1.5rem;">Welcome to Bankist, <strong>${fullName}</strong>!</p>
          <div style="background: #fff; border-radius: 1.2rem; padding: 2rem; margin: 1.5rem 0; border: 1px solid #ddd; box-shadow: 0 1rem 2rem rgba(0,0,0,0.05);">
            <p style="margin-bottom: 1rem; color: #333;">
              Your User ID: <strong style="color: var(--color-primary-darker); font-size: 2.2rem; display: inline-block; background: #eef9f2; padding: 0.2rem 1.2rem; border-radius: 0.6rem;">${username}</strong>
            </p>
            <p style="margin-bottom: 1rem; color: #333;">
              Your PIN: <strong style="font-size: 2.2rem; display: inline-block; background: #f0f0f0; padding: 0.2rem 1.2rem; border-radius: 0.6rem;">${pin}</strong>
            </p>
            <p style="color: #666; font-size: 1.5rem;">Starting Balance: <strong>1,650€</strong></p>
          </div>
          <p style="color: #888; font-size: 1.4rem;">
            Redirecting to your Banking App in <span id="countdown" style="font-weight: 700; color: var(--color-primary);">2</span>s...
          </p>
        </div>
        <div style="display: flex; justify-content: center;">
          <a href="app.html" class="btn" style="text-decoration: none; color: #222; font-size: 1.6rem; text-align: center;">
            Open Bankist App Now &rarr;
          </a>
        </div>
      `;

      // Countdown and redirect
      let timeLeft = 2;
      const countdownTimer = setInterval(() => {
        timeLeft--;
        const countdownEl = document.querySelector('#countdown');
        if (countdownEl) countdownEl.textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(countdownTimer);
          window.location.href = 'app.html';
        }
      }, 1000);
    }
  });
}

///////////////////////////////////////
// Button scrolling ("Learn more")
btnScrollTo?.addEventListener('click', function () {
  section1?.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation (Event Delegation)
document.querySelector('.nav__links')?.addEventListener('click', function (e) {
  // Ignore modal buttons and external links like app.html
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn') &&
    !e.target.classList.contains('nav__link--app')
  ) {
    const id = e.target.getAttribute('href');
    if (id && id.startsWith('#')) {
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

///////////////////////////////////////
// Tabbed component (Operations)
tabsContainer?.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    ?.classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
    if (logo) logo.style.opacity = opacity;
  }
};

nav?.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});
nav?.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

///////////////////////////////////////
// Sticky navigation
if (header && nav) {
  const navHeight = nav.getBoundingClientRect().height;

  const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  };

  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });

  headerObserver.observe(header);
}

///////////////////////////////////////
// Reveal sections on scroll
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider component
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  if (!slides.length) return;

  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    if (!dotContainer) return;
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      ?.classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  btnRight?.addEventListener('click', nextSlide);
  btnLeft?.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer?.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      curSlide = Number(slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });
};
slider();

///////////////////////////////////////
// Cookie message banner
if (header) {
  const message = document.createElement('div');
  message.classList.add('cookie-message');
  message.innerHTML =
    'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

  header.append(message);

  document
    .querySelector('.btn--close-cookie')
    ?.addEventListener('click', function () {
      message.remove();
    });
}
