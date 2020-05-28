import "./style.css";
import getTime from './time.js';

const elementToTranslate = document.querySelectorAll('[data-i18n]');
const searchInput = document.getElementById('searchInput');
const changeLanguageButton = document.getElementById('languageButton');
const languageButton = document.querySelectorAll('.dropdown-item');
const buttonSearch = document.getElementById('buttonSearch');

const languages = {
    EN : "en.json",
    RU : "ru.json",
    BE : "be.json",
}

window.addEventListener('load', () =>{
    getPosition();
    getTime();
});
const latitudeHtml = document.getElementById('latitude');
const longitudeHtml = document.getElementById('longitude');
function getPosition() {
let latitude;
let longitude;
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            latitude  = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log(position.coords);
            map.flyTo({ center: [longitude, latitude] });
            latitudeHtml.innerText = `Latitude: ${getDMS(latitude, 'lat')}`;
            longitudeHtml.innerText = `Longitude: ${getDMS(longitude, 'long')}`;
            getCurrentWeather(`${latitude}, ${longitude}`);
            getWeatherForDays(`${latitude}, ${longitude}`);
        });
    }   
};

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
    if (event.target.id === 'buttonSearch') {
        event.preventDefault(); 
        getCurrentWeather(searchInput.value);
        getLocation();
    }
});
const apiKey = 'd9cbddc7739840c4bd5122238202605';


const temperature = document.getElementById('temperature');
const weatherText = document.getElementById('text');
const feelslike = document.getElementById('feelslike');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const region = document.getElementById('region');
const country = document.getElementById('country');
const name = document.getElementById('name');

function getCurrentWeather(value) {
const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${value}`    
    return fetch(weatherUrl)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setCurrentWeatherData(data);
            map.flyTo({ center: [longitude, latitude] });
        });    
};

function setCurrentWeatherData(data) {
    temperature.innerText = `${Math.round(data.current.temp_c)}°`;
    weatherText.innerText = data.current.condition.text;
    feelslike.innerText = `Feels Like: ${Math.round(data.current.feelslike_c)}°`;
    wind.innerText = `Wind: ${Math.round(data.current.wind_kph * 1000 / 60 / 60)} m/s`;
    humidity.innerText = `Humidity: ${data.current.humidity}%`;
    name.innerText = data.location.name;
    region.innerText = data.location.region;
    country.innerText = data.location.country;
}
function getWeatherForDays(value) {
    const weatherDaysUrl =  `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=q=${value}&dt=2020-05-30`;
    return fetch(weatherDaysUrl)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setWeatherForDays(data)
        })    
}
const forecastDay1 = document.getElementById('forecastday1');
const forecastDay2 = document.getElementById('forecastday2');
const forecastDay3 = document.getElementById('forecastday3');

function setWeatherForDays(data) {
    forecastDay1.innerText = data.forecast.forecastday[1].day.avgtemp_c;

};


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

let lat = 13.041107;
let lon = 80.233232;

let latDMS = getDMS(lat, 'lat'); 
let lonDMS = getDMS(lon, 'long');
console.log('latDMS: '+ latDMS);
console.log('lonDMS: '+ lonDMS);





var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoibWlraXN1bSIsImEiOiJja2FvYmE0cHQwcDN0MnlwZmppNnQ4c21vIn0.hw0Slxj8zfqIGrT6TFkagw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  zoom: 11
});


function getLocation() {
const locationUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchInput.value}.json?&autocomplete=false&access_token=${mapboxgl.accessToken}`;
    return fetch(locationUrl)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            // setWeatherInfo(data)
        });    
};

