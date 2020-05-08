class MovieCard {
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
  
    getHtmlCard() {
      return this.htmlCard;
    }
  }

  export default MovieCard;