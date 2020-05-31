import './style.css';
import months from './months';
import getDayName from './days';

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

// const bounds = [-122.5336, 37.7049, -122.3122, 37.8398]; // wsen

// const mask = turf.polygon([
//   [
//     [-122.43764877319336,
//       37.78645343442073,
//     ],
//     [-122.40056991577148,
//       37.78930232286027,
//     ],
//     [-122.39172935485838,
//       37.76630458915842,
//     ],
//     [-122.43550300598145,
//       37.75646561597495,
//     ],
//     [-122.45378494262697,
//       37.7781096293495,
//     ],
//     [-122.43764877319336,
//       37.78645343442073,
//     ],
//   ],
// ]);

mapboxgl.accessToken = 'pk.eyJ1IjoibWlraXN1bSIsImEiOiJja2FvYmE0cHQwcDN0MnlwZmppNnQ4c21vIn0.hw0Slxj8zfqIGrT6TFkagw';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  // center: [-122.42116928100586, 37.77532815168286],
  // maxBounds: bounds,
  zoom: 11,
});

// function polyMask(mask, bounds) {
//   const bboxPoly = turf.bboxPolygon(bounds);
//   return turf.difference(bboxPoly, mask);
// }

// map.on('load', () => {
//   map.addSource('mask', {
//     type: 'geojson',
//     data: polyMask(mask, bounds),
//   });

//   map.addLayer({
//     id: 'zmask',
//     source: 'mask',
//     type: 'fill',
//     paint: {
//       'fill-color': 'white',
//       'fill-opacity': 0.999,
//     },
//   });
// });

const elementToTranslate = document.querySelectorAll('[data-i18n]');
const searchInput = document.getElementById('searchInput');
const changeLanguageButton = document.getElementById('languageButton');
const languageButton = document.querySelectorAll('.dropdown-item');
const locationElements = document.querySelectorAll('.location');

const languages = {
  EN: 'en.json',
  RU: 'ru.json',
  BE: 'be.json',
};

let backgroudImages = [];

window.addEventListener('load', () => {
  getImages()
    .then((res) => res.json())
    .then((data) => {
      backgroudImages = data.photos.photo;
      updateBackground();
    });
  updateDate();
  setInterval(updateTime, 1000);
  getPosition(updateWeather);
});

const latitudeHtml = document.getElementById('latitude');
const longitudeHtml = document.getElementById('longitude');

function updatePosition(latitude, longitude) {
  latitudeHtml.innerText = `Latitude: ${getDMS(latitude, 'lat')}`;
  latitudeHtml.setAttribute('data-i18n', latitudeHtml.innerText);
  longitudeHtml.innerText = `Longitude: ${getDMS(longitude, 'long')}`;
  longitudeHtml.setAttribute('data-i18n', longitudeHtml.innerText);
  map.flyTo({ center: [longitude, latitude] });
}

function updateWeather(location) {
  return getWeatherData(location)
    .then(getWeatherForThirdDay(location));
}

function updateBackground() {
  const random = Math.round(Math.random() * backgroudImages.length);
  const imageUrl = backgroudImages[random].url_h;
  document.body.style.background = `linear-gradient(rgba(8, 15, 26, 0.59) 0%, rgba(17, 17, 46, 0.46) 100%) center center / cover fixed, url(\'${imageUrl}\') center center no-repeat fixed`;
  document.body.style.backgroundSize = 'cover';
}

function getPosition(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      callback(`${latitude}, ${longitude}`)
        .then(() => {
          const language = sessionStorage.getItem('language');
          if (language) {
            if (currentLanguage !== language) {
              translate(language)
                .then(() => {
                  currentLanguage = language;
                  changeLanguageButton.textContent = language;
                });
            }
          }
        });
    });
  }
}

const apiKeyFlikr = '2f8ea488a21e4fac07f04c7fffc9898d';
function getImages() {
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKeyFlikr}&tags=nature,spring,morning&tag_mode=all&extras=url_h&format=json&nojsoncallback=1`;
  return fetch(url);
}

const translateKey = 'trnsl.1.1.20200507T084819Z.f390e50612a690db.7c1617d6408fa233a30cc9ef9d5f1a43827ff027';
function getYandexTranslate(inputText, language) {
  const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${translateKey}&text=${inputText}&lang=${currentLanguage.toLowerCase()}-${language.toLowerCase()}`;
  return fetch(url).then((res) => res.json());
}

function translate(lang) {
  return fetch(`languages/${languages[lang]}`)
    .then((res) => res.json())
    .then((langFile) => {
      elementToTranslate.forEach((element) => {
        const path = element.dataset.i18n.split('.');
        let result = langFile;
        path.forEach((piece) => {
          if (result) {
            result = result[piece];
          }
        });

        if (result) {
          element.textContent = result;
        } else {
          result = element.dataset.i18n;
          result.split(' ').forEach((piece) => {
            const key = piece.replace(':', '');
            const translation = langFile[key];
            if (translation) {
              result = result.replace(key, translation);
            }
          });
          element.textContent = result;
        }
      });
      searchInput.setAttribute('placeholder', langFile.search);
      const dayElements = day.getAttribute('data').split(' ');
      day.innerText = `${langFile.days[dayElements[0]]} ${dayElements[1]} ${langFile.month[dayElements[2]]}`;
      locationElements.forEach((element) => {
        getYandexTranslate(element.textContent, lang).then((data) => {
          element.textContent = data.text;
        });
      });
    });
}

let currentLanguage = changeLanguageButton.textContent;
document.addEventListener('click', (event) => {
  if (event.target.closest('.dropdown-item')) {
    languageButton.forEach((el) => el.classList.remove('active'));
    event.target.classList.add('active');
    translate(event.target.textContent)
      .then(() => {
        currentLanguage = event.target.textContent;
        sessionStorage.setItem('language', currentLanguage);
      });
    changeLanguageButton.textContent = event.target.textContent;
  } else if (event.target.id === 'buttonSearch') {
    event.preventDefault();
    updateWeather(searchInput.value);
    updateBackground();
  } else if (event.target.id === 'syncButton') {
    updateBackground();
  } else if (event.target.id === 'CelToFar') {
    temperatureConverter('F');
  } else if (event.target.id === 'FarToCel') {
    temperatureConverter('C');
  }
});
const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    updateWeather(searchInput.value);
    updateBackground();
  }
});

let temperatureUnits = 'C';
const temperatureElements = document.getElementsByClassName('temperature');
function temperatureConverter(units) {
  if (units !== temperatureUnits) {
    temperatureElements.forEach((element) => {
      if (units === 'F') {
        const degree = parseFloat(element.innerText);
        element.innerText = `${Math.round((degree * 1.8) + 32)}°`;
      } else {
        const degree = parseFloat(element.innerText);
        element.innerText = `${Math.round((degree - 32) / 1.8)}°`;
      }
    });
    temperatureUnits = units;
  }
}
const apiKey = 'd9cbddc7739840c4bd5122238202605';


const currentTemperature = document.getElementById('temperature');
const weatherText = document.getElementById('text');
const feelslike = document.getElementById('feelslike');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const region = document.getElementById('region');
const country = document.getElementById('country');
const name = document.getElementById('name');

const weatherForDay1 = document.getElementById('weatherForDay1');
const weatherForDay2 = document.getElementById('weatherForDay2');
const weatherForDay3 = document.getElementById('weatherForDay3');
const currentWeatherIcon = document.getElementById('weather-icon');
const weatherIcon1 = document.getElementById('weather-icon1');
const weatherIcon2 = document.getElementById('weather-icon2');
const weatherIcon3 = document.getElementById('weather-icon3');

function setWeatherData(data) {
  currentTemperature.innerText = `${data.current.temp_c}°`;
  currentWeatherIcon.src = data.current.condition.icon;
  weatherText.innerText = data.current.condition.text;
  weatherText.setAttribute('data-i18n', `weather.${weatherText.innerText}`);
  feelslike.innerText = `Feelslike: ${Math.round(data.current.feelslike_c)}°`;
  feelslike.setAttribute('data-i18n', feelslike.innerText);
  wind.innerText = `Wind: ${Math.round(data.current.wind_kph * 1000 / 60 / 60)} m/s`;
  wind.setAttribute('data-i18n', wind.innerText);
  humidity.innerText = `Humidity: ${data.current.humidity}%`;
  humidity.setAttribute('data-i18n', humidity.innerText);
  name.innerText = data.location.name;
  region.innerText = data.location.region;
  country.innerText = data.location.country;
  weatherForDay1.innerText = `${data.forecast.forecastday[1].day.avgtemp_c}°`;
  weatherForDay2.innerText = `${data.forecast.forecastday[2].day.avgtemp_c}°`;
  weatherIcon1.src = data.forecast.forecastday[1].day.condition.icon;
  weatherIcon2.src = data.forecast.forecastday[2].day.condition.icon;
  updatePosition(data.location.lat, data.location.lon);
}

function setWeatherForThirdDay(data) {
  weatherForDay3.innerText = `${data.forecast.forecastday[0].day.avgtemp_c}°`;
  weatherIcon3.src = data.forecast.forecastday[0].day.condition.icon;
}

function getWeatherData(value) {
  const weatherDaysUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${value}&days=3`;
  // console.log(weatherDaysUrl);
  return fetch(weatherDaysUrl)
    .then((res) => res.json())
    .then((data) => {
      setWeatherData(data);
    });
}


function getWeatherForThirdDay(value) {
  const today = new Date();
  const thirdDay = (new Date(today.setDate(today.getDate() + 3))).toISOString().slice(0, 10);
  const weatherTherdDay = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${value}&dt=${thirdDay}`;
  return fetch(weatherTherdDay)
    .then((res) => res.json())
    .then((data) => {
      setWeatherForThirdDay(data);
    });
}

function truncate(n) {
  return n > 0 ? Math.floor(n) : Math.ceil(n);
}

let getDMS = function (dd, longOrLat) {
  const hemisphere = /^[WE]|(?:lon)/i.test(longOrLat)
    ? dd < 0
      ? 'W'
      : 'E'
    : dd < 0
      ? 'S'
      : 'N';

  const absDD = Math.abs(dd);
  const degrees = truncate(absDD);
  const minutes = truncate((absDD - degrees) * 60);
  const seconds = ((absDD - degrees - minutes / 60) * Math.pow(60, 2)).toFixed(2);

  const dmsArray = [degrees, minutes, seconds, hemisphere];
  return `${dmsArray[0]}°${dmsArray[1]}'${dmsArray[2]}" ${dmsArray[3]}`;
};

const time = document.getElementById('time');
const day = document.getElementById('date');

const day1 = document.getElementById('day1');
const day2 = document.getElementById('day2');
const day3 = document.getElementById('day3');

function updateDate() {
  const today = new Date();
  const currentDate = today.getDate();
  const currentMonth = today.getUTCMonth();
  const currentDay = today.getDay();
  day.innerText = `${getDayName(currentDay).substring(0, 3)} ${currentDate} ${months[currentMonth]} `;
  day.setAttribute('data', day.innerText);
  day1.innerText = getDayName(currentDay + 1);
  day2.innerText = getDayName(currentDay + 2);
  day3.innerText = getDayName(currentDay + 3);
  day1.setAttribute('data-i18n', `days.${day1.innerText}`);
  day2.setAttribute('data-i18n', `days.${day2.innerText}`);
  day3.setAttribute('data-i18n', `days.${day3.innerText}`);
}

function updateTime() {
  const today = new Date();
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();
  const currentTime = `${hours}:${minutes}:${seconds}`;
  time.innerText = currentTime;
}
