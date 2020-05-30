import "./style.css";
import months from './months.js';
import getDayName from './days.js';

const elementToTranslate = document.querySelectorAll('[data-i18n]');
const searchInput = document.getElementById('searchInput');
const changeLanguageButton = document.getElementById('languageButton');
const languageButton = document.querySelectorAll('.dropdown-item');

const languages = {
    EN : "en.json",
    RU : "ru.json",
    BE : "be.json",
}

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

function updatePosition (latitude, longitude) {
    latitudeHtml.innerText = `Latitude: ${getDMS(latitude, 'lat')}`;
    longitudeHtml.innerText = `Longitude: ${getDMS(longitude, 'long')}`;
    map.flyTo({ center: [longitude, latitude] });
}

function updateWeather (location) {
    getWeatherData(location);
    getWeatherForThirdDay(location);
}

function updateBackground() {
    const random = Math.round(Math.random() * 100);
    const imageUrl = backgroudImages[random].url_h;
    document.body.style.background = `linear-gradient(rgba(8, 15, 26, 0.59) 0%, rgba(17, 17, 46, 0.46) 100%) center center / cover fixed, url(\'${imageUrl}\') center center no-repeat fixed`;
    document.body.style.backgroundSize = 'cover';
}

function getPosition(callback) {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude  = position.coords.latitude;
            const longitude = position.coords.longitude;
            callback(`${latitude}, ${longitude}`);
        });
    }
};

const apiKeyFlikr = '2f8ea488a21e4fac07f04c7fffc9898d';
function getImages() {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKeyFlikr}&tags=nature,spring,morning&tag_mode=all&extras=url_h&format=json&nojsoncallback=1`;
    return fetch(url);
}

function translate(lang) {
    return fetch(`languages/${languages[lang]}`)
            .then(res => res.json())
            .then(langFile => {
                elementToTranslate.forEach(element => {
                element.textContent = langFile[element.dataset.i18n];
                });
                searchInput.setAttribute("placeholder", langFile['search']);
            });
}

document.addEventListener('click', (event) => {
    if (event.target.closest('.dropdown-item')) {
        languageButton.forEach(el => el.classList.remove('active'));
            event.target.classList.add('active');
            changeLanguageButton.innerText = event.target.innerText;
            translate(changeLanguageButton.innerText);
    }
    else if (event.target.id === 'buttonSearch') {
        event.preventDefault();
        updateWeather(searchInput.value);
        updateBackground();
    }
    else if (event.target.id === 'syncButton') {
        updateBackground();
    }
    else if (event.target.id === 'CelToFar') {
        temperatureConverter("F");
    }
    else if (event.target.id === 'FarToCel') {
        temperatureConverter("C");
    }
});
const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();
        updateWeather(searchInput.value);
        updateBackground();
    }
});

let temperatureUnits = "C";
const temperatureElements = document.getElementsByClassName('temperature');
function temperatureConverter(units) {
    if (units !== temperatureUnits)
    {
        temperatureElements.forEach(element => {
            if (units === "F") {
                const degree = parseFloat(element.innerText);
                element.innerText = `${(degree * 1.8) + 32}°`;
            }
            else {
                const degree = parseFloat(element.innerText);
                element.innerText = `${(degree - 32) / 1.8}°`;
            }
        });
        temperatureUnits = units;
    }
};
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

function setWeatherData(data) {
    currentTemperature.innerText = `${data.current.temp_c}°`;
    weatherText.innerText = data.current.condition.text;
    feelslike.innerText = `Feels Like: ${Math.round(data.current.feelslike_c)}°`;
    wind.innerText = `Wind: ${Math.round(data.current.wind_kph * 1000 / 60 / 60)} m/s`;
    humidity.innerText = `Humidity: ${data.current.humidity}%`;
    name.innerText = data.location.name;
    region.innerText = data.location.region;
    country.innerText = data.location.country;
    weatherForDay1.innerText = `${data.forecast.forecastday[1].day.avgtemp_c}°`;
    weatherForDay2.innerText = `${data.forecast.forecastday[2].day.avgtemp_c}°`;
    updatePosition(data.location.lat, data.location.lon);
}

function setWeatherForThirdDay(data) {
    weatherForDay3.innerText = `${data.forecast.forecastday[0].day.avgtemp_c}°`;
}

function getWeatherData(value) {
    const weatherDaysUrl =  `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${value}&days=3`;
    // console.log(weatherDaysUrl);
    return fetch(weatherDaysUrl)
        .then((res) => res.json())
        .then((data) => {
            // console.log(data);
            setWeatherData(data);
        })    
}


function getWeatherForThirdDay(value) {
    const today = new Date();
    const thirdDay = (new Date(today.setDate(today.getDate() + 3))).toISOString().slice(0,10);
    const weatherTherdDay =  `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${value}&dt=${thirdDay}`;
    return fetch(weatherTherdDay)
        .then((res) => res.json())
        .then((data) => {
            // console.log(data);
            setWeatherForThirdDay(data)
        })    
}

function truncate(n) {
    return n > 0 ? Math.floor(n) : Math.ceil(n);
}

let getDMS = function (dd, longOrLat) {
    let hemisphere = /^[WE]|(?:lon)/i.test(longOrLat)
    ? dd < 0
      ? "W"
      : "E"
    : dd < 0
      ? "S"
      : "N";
    
    const absDD = Math.abs(dd);
    const degrees = truncate(absDD);
    const minutes = truncate((absDD - degrees) * 60);
    const seconds = ((absDD - degrees - minutes / 60) * Math.pow(60, 2)).toFixed(2);
    
    let dmsArray = [degrees, minutes, seconds, hemisphere];
    return `${dmsArray[0]}°${dmsArray[1]}'${dmsArray[2]}" ${dmsArray[3]}`;
}

const time = document.getElementById('time');
const day= document.getElementById('date');

const day1 = document.getElementById('day1');
const day2 = document.getElementById('day2');
const day3 = document.getElementById('day3');

function updateDate() {
    const today = new Date();
    const currentDate = today.getDate(); 
    const currentMonth = today.getUTCMonth();
    const currentDay = today.getDay();
    day.innerText = `${getDayName(currentDay).substring(0,3)} ${currentDate} ${months[currentMonth]} `;
    day1.innerText = getDayName(currentDay + 1);
    day2.innerText = getDayName(currentDay + 2);
    day3.innerText = getDayName(currentDay + 3);
}

function updateTime() {
    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    const currentTime = `${hours}:${minutes}:${seconds}`;
    time.innerText = currentTime;
}

var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoibWlraXN1bSIsImEiOiJja2FvYmE0cHQwcDN0MnlwZmppNnQ4c21vIn0.hw0Slxj8zfqIGrT6TFkagw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  zoom: 11
});


// function getLocation() {
// const locationUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchInput.value}.json?&autocomplete=false&access_token=${mapboxgl.accessToken}`;
//     return fetch(locationUrl)
//         .then((res) => res.json())
//         .then((data) => {
//             // console.log(data);
//             // setWeatherInfo(data)
//         });    
// };

