var swiper;
window.onload = function () {
  swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
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
      }
    })
  };

let input = document.getElementById('input');
input.focus();

// search.addEventListener('keypress', function(element) => {
//   if element
// })
// window.onload = function () {

// }

let clear = document.getElementById('clear');
let form = document.getElementById('form');
clear.addEventListener('click', () => {
    form.reset();
    input.focus();
});

let buttonSearch = document.getElementById('search');
document.addEventListener('click', (event) => {
  if (event.target.closest('#search')) {
    getMovies(1, input.value);
  }
}); 

const key = 'edb21aab';

// const sliderContainer = document.getElementById('sliderContainer');
let movieCards = [];

function getMovies(page, word) {
    const url = `https://www.omdbapi.com/?s=${word}&page=${page}&apikey=${key}`;
   
    return fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.Search.length > 0){
          swiper.removeAllSlides();
        }
        data.Search.forEach(element => {
          const movieCard = new Movie(element);
          movieCards.push(movieCard);
          swiper.appendSlide(movieCard.getHtmlCard());
          // sliderContainer.append(movieCard.getHtmlCard());
        });
      });    
}

// function getRating(id) {
//   const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`;
  
//   return fetch(url)
//       .then(res => res.json())
//       .then(data => {
//        console.log(data.imdbRating);
//       });
// }

getMovies(1, 'home');
// getMovies(2, 'home');
// getMovies(3, 'home');

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
    title.setAttribute('href', Title);
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
};


