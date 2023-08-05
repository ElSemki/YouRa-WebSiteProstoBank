'use strict';

const modalWindow = document.querySelector('.modal-window');
const overlay = document.querySelector('.overlay');
const btnCloseModalWindow = document.querySelector('.btn--close-modal-window');
const btnsOpenModalWindow = document.querySelectorAll(
  '.btn--show-modal-window'
);
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const lazyImages = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

// Раздел: Modal
const openModalWindow = function (e) {
  e.preventDefault();
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModalWindow.forEach(button =>
  button.addEventListener('click', openModalWindow)
);

btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});

// Раздел: Scroll to section1
btnScrollTo.addEventListener('click', e => {
  e.preventDefault();
  // Пример: Старый метод
  // const section1Coords = section1.getBoundingClientRect();
  // console.log(section1Coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log('Текущее прокручивание: x, y', window.scrollX, window.scrollY);
  // console.log(
  //   'Ширина и высота viewport',
  //   document.documentElement.clientWidth,
  //   document.documentElement.clientHeight
  // );
  // window.scrollTo({
  //   left: section1Coords.left + window.scrollX,
  //   top: section1Coords.top + window.scrollY,
  //   behavior: 'smooth',
  // });
  // Пример: современный метод
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Раздел: Scroll to sections
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const href = e.target.getAttribute('href');
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  }
});

// Раздел: Tabs

tabContainer.addEventListener('click', function (e) {
  const clickedBtn = e.target.closest('.operations__tab');
  if (!clickedBtn) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clickedBtn.classList.add('operations__tab--active');

  tabContents.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clickedBtn.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Раздел: Hover links
const navLinksHoverAnim = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const linkOver = e.target;
    const siblingLinks = linkOver
      .closest('.nav__links')
      .querySelectorAll('.nav__link');
    const logo = linkOver.closest('.nav').querySelector('.nav__logo');
    const logoText = linkOver.closest('.nav').querySelector('.nav__text');

    siblingLinks.forEach(link => {
      if (link !== linkOver) link.style.opacity = this;
    });
    logo.style.opacity = this;
    logoText.style.opacity = this;
  }
};
// * Передача аргументов bind / this
nav.addEventListener('mouseover', navLinksHoverAnim.bind(0.4));
nav.addEventListener('mouseout', navLinksHoverAnim.bind(1));

// Раздел: Sticky nav
// const section1Coords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (this.window.scrollY > section1Coords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// Раздел: Sticky nav - Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;
const getStickyNav = function (entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(getStickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Раздел: Появление секций сайта
const appearanceSection = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(appearanceSection, {
  root: null,
  threshold: 0.2,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Раздел: Имплементация lazy loading для изображений
const loadImages = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const lazyImagesObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0.7,
});

lazyImages.forEach(img => lazyImagesObserver.observe(img));

// Раздел: Slider
let currentSlide = 0;
const slidesNumber = slides.length;

const moveToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
  );
};

moveToSlide(0);

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.classList.add('dots__dot');
  dot.setAttribute('data-slide', `${i}`);
  dotContainer.append(dot);
});

const activateCurrentDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activateCurrentDot(currentSlide);

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    moveToSlide(slide);
    activateCurrentDot(slide);
  }
});

const nextSlide = function () {
  if (currentSlide === slidesNumber - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};

const prevSlide = function () {
  if (currentSlide === 0) {
    currentSlide = slidesNumber - 1;
  } else {
    currentSlide--;
  }
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
  activateCurrentDot(currentSlide);
});

///////////////////////////////////////////////////
//! Лекционный материал
// Тема: Dom & Events. Продвинутый уровень
// Раздел: Выбор, создание и удаление элементов
// Описание: Выбор элементов
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// console.log(document.querySelector('.header'));

// const sections = document.querySelectorAll('.section');
// console.log(sections);

// console.log(document.getElementById('section--1'));
// console.log(document.getElementsByTagName('button'));
// console.log(document.getElementsByClassName('btn'));

// Описание: Создание и вставка элементов
// * .insertAdjacentHTML()
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent =
//   'Мы используем на этом сайте cookie для улучшения функциональности.';
// message.innerHTML = `
// 'Мы используем на этом сайте cookie для улучшения функциональности.
//  <button class="btn btn--close-cookie">Ок</button>`;
// const header = document.querySelector('.header');
// header.prepend(message); // Добавляет элемент в начало
// header.append(message);
// header.before(message); // Добавляет элемент до header
// header.after(message // Добавляет элемент после header
// header.append(message.cloneNode(true));

// Описание: Удаление элементов
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', () => message.remove());

// Раздел: Стили, атрибуты, классы

// Описание: Стили
// message.style.backgroundColor = '#076785';
// message.style.width = '100%';

// console.log(message.style.width);
// console.log(message.style.color);
// console.log(message.style.backgroundColor);

// console.log(getComputedStyle(message).color);
// message.style.height = parseFloat(getComputedStyle(message).height) + 50 + 'px';

// document.documentElement.style.setProperty('--color-first', 'yellow');

// Описание: Атрибуты
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.getAttribute('src'));
// console.log(logo.className);

// Пример: Считать нестандартный атрибут
// console.log(logo.developer); //! Не правильно!
// console.log(logo.getAttribute('developer'));

// Пример: Установить значение атрибутов
// logo.alt = 'Лого Прекрасного Банка';
// logo.setAttribute('copyright', 'Master Of Code');

// Описание: Data attributes
// console.log(logo.dataset.versionNumber);

// Описание: Classes
// logo.classList.add('')
// logo.classList.remove('')
// logo.classList.toggle('')
// logo.classList.contains('')

// Пример: Не использовать!
// logo.className = 'a';

// Раздел: Event Propagation
// function getRandomIntInclusive(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

// const getRandomColor = () =>
//   `rgb(${getRandomIntInclusive(0, 255)}, ${getRandomIntInclusive(
//     0,
//     255
//   )}, ${getRandomIntInclusive(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = getRandomColor();
//   e.stopPropagation(); // ! Stop Propagation
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = getRandomColor();
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = getRandomColor();
// });

// Раздел: Перемещение по DOM
// const h1 = document.querySelector('h1');
// Пример: Перемещение вниз (к потомкам)
// console.log(h1.querySelectorAll('.highlight')); //* Вложенность не важна
// console.log(h1.childNodes); //* Редко применяется на практике
// console.log(h1.children); //* Прямые потомки (без вложенности)
// console.log(h1.firstElementChild);
// console.log(h1.lastElementChild);

// Пример: Перемещение вверх (к родителям)
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// const h2 = document.querySelector('h2');
// console.log(h2.closest('.section')); //* Получаем не прямого ближайшего родителя

// Пример: Перемещение на одном уровне
// console.log(h2.previousElementSibling); //* Предыдущий сосед на одном уровне
// console.log(h2.nextElementSibling); //* Следующий сосед на одном уровне

// console.log(h1.parentElement.children); //* Получение всех элементов на уровне h1

// Раздел: Intersection Observer API
// const observerCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };
// const observerOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1);
