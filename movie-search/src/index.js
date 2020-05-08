import swiper from './swiper.js';
import "./style.css";
import MovieCard from "./MovieCard.js";

const input = document.getElementById('input');
const clear = document.getElementById('clear');
const form = document.getElementById('form');
const searchButton = document.getElementById('search');
const notice = document.getElementById('notice');

clear.addEventListener('click', () => {
    form.reset();
    input.focus();
});

input.focus();

const key = 'edb21aab';
let page = 1;
let word = 'home';

let loadIcon = document.createElement('span');
function createLoadIcon() {
  loadIcon.className = 'spinner-border spinner-border-sm';
  loadIcon.setAttribute('role', 'status');
  loadIcon.setAttribute('aria-hidden', 'true');
  searchButton.append(loadIcon);
}

function getMovies() {
  const url = `https://www.omdbapi.com/?s=${word}&page=${page}&apikey=${key}`;
  return fetch(url)
    // .catch(error => notice.innerText = error.message)
    .then(res => res.json())
    .then(data => {
      data.Search.forEach(element => {
        const movieCard = new MovieCard(element);
        swiper.appendSlide(movieCard.getHtmlCard());
      });
    })
    // .catch(notice.innerText = `No resultts for ${word}`);
}
const translateKey = 'trnsl.1.1.20200507T084819Z.f390e50612a690db.7c1617d6408fa233a30cc9ef9d5f1a43827ff027';

function getTranslate(input) {
  const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${translateKey}&text=${input}&lang=ru-en`;
  return fetch(url)

    .then(res => res.json())
    .catch(notice.innerText = `No resultts for ${input.value}`);
}

function searchMovies() {
  swiper.removeAllSlides();
  page = 1;
  getTranslate(input.value)
    .then(data => {
      word = data.text;
      input.value = word;
      notice.innerText = `Showing result for ${word}`; 
      getMovies()
        .then(loadIcon.remove())
    })
    .catch(notice.innerText = `No resultts for ${input.value}`);
    
}
searchButton.addEventListener('click', function(event) {
  createLoadIcon();
  searchMovies();
}); 

form.addEventListener('submit', (event) => {
  event.preventDefault(); 
  searchMovies();
});

swiper.on('slideChange', function() {
  if (!swiper.slides.length)
    return;

  if (swiper.activeIndex >= swiper.slides.length - swiper.params.slidesPerView - 2) {
    page += 1;
    getMovies();
  }
});

getMovies(1, 'home');