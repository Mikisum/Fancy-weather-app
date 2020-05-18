import Swiper from 'swiper';
import './swiper.css';

const swiper = new Swiper('.swiper-container', {
  slidesPerView: 1,
  spaceBetween: 10,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
    renderBullet(index, className) {
      return `<span class="${className}">${index + 1}</span>`;
    },
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
  },
});

export default swiper;
