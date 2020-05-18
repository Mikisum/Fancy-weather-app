const key = 'edb21aab';

class MovieCard {
  constructor({
    Title, Year, imdbID, Poster,
  }) {
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
    cardBody.className = 'card-body w-100';
    this.htmlCard.append(cardBody);

    const title = document.createElement('a');
    title.className = 'nav-link';
    title.setAttribute('target', '_blank');
    title.setAttribute('href', `https://www.imdb.com/title/${imdbID}/videogallery/window-open`);
    title.innerText = Title;
    cardBody.append(title);

    const infoContainer = document.createElement('div');
    infoContainer.className = 'd-flex justify-content-between';
    cardBody.append(infoContainer);

    const year = document.createElement('p');
    year.className = 'card-text';
    year.innerText = Year;
    infoContainer.append(year);

    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'd-inline-flex';
    infoContainer.append(ratingContainer);

    const starIcon = document.createElement('i');
    starIcon.className = 'fas fa-star pr-1';
    ratingContainer.append(starIcon);

    this.htmlRating = document.createElement('p');
    this.htmlRating.className = 'card-text';
    ratingContainer.append(this.htmlRating);
  }

  getHtmlCard() {
    return this.htmlCard;
  }

  fetchRating(id) {
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`;
    return fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.htmlRating.innerText = data.imdbRating;
      });
  }
}

export { MovieCard, key };
