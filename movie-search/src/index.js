import swiper from './swiper.js';
import "./style.css";







// window.onload = function () {

// }
const input = document.getElementById('input');
const clear = document.getElementById('clear');
const form = document.getElementById('form');
const searchButton = document.getElementById('search');
clear.addEventListener('click', () => {
    form.reset();
    input.focus();
});

input.focus();

const key = 'edb21aab';
// var movieCards = [];
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
    .then(res => res.json())
    .then(data => {
      data.Search.forEach(element => {
        const movieCard = new Movie(element);
        // movieCards.push(movieCard);
        swiper.appendSlide(movieCard.getHtmlCard());
      });
    });
}
const translateKey = 'trnsl.1.1.20200507T084819Z.f390e50612a690db.7c1617d6408fa233a30cc9ef9d5f1a43827ff027';

function getTranslate(input) {
  const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${translateKey}&text=${input}&lang=ru-en`;
  return fetch(url)
    .then(res => res.json());
}

function searchMovies() {
  swiper.removeAllSlides();
  page = 1;
  getTranslate(input.value)
    .then(data => {
      word = data.text;
      getMovies()
        .then(loadIcon.remove());
    });
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

class Movie {
  constructor({Title, Year, imdbID, Poster, Type}) {
    this.title = Title;
    this.year = Year;
    this.poster = Poster;
    this.fetchRating(imdbID);

    this.htmlCard = document.createElement('div');
    this.htmlCard.className = 'swiper-slide card';
    
    const poster = document.createElement('img');
    poster.className = 'card-img-top';
    poster.setAttribute('src', Poster);
    this.htmlCard.append(poster);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    this.htmlCard.append(cardBody);

    const title = document.createElement('a');
    title.setAttribute('href', `https://www.imdb.com/title/${imdbID}/videogallery`);
    title.innerText = Title;
    cardBody.append(title);

    const year = document.createElement('p');
    year.className = 'card-text';
    year.innerText = Year;
    cardBody.append(year);

    this.htmlRating = document.createElement('p');
    this.htmlRating.className = 'card-text';
    cardBody.append(this.htmlRating);
  }

  async fetchRating(id) {
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    this.htmlRating.innerText = data.imdbRating;
  }

  getHtmlCard()
  {
    return this.htmlCard;
  }
}


