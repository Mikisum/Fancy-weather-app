import "./style.css";
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
            latitudeHtml.innerText = 'Latitude:' + latitude;
        });
    } 
    getCurrentWeather(longitude, latitude);  
   
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
    if (event.target.id === 'buttonSearch') {
        event.preventDefault(); 
        getCurrentWeather();
        getLocation();
    }
});
const apiKey = 'd9cbddc7739840c4bd5122238202605';
const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Minsk`
const weatherDaysUrl =  `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=07112&days=7`

const temperature = document.getElementById('temperature');
const weatherText = document.getElementById('text');
const feelslike = document.getElementById('feelslike');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');

function getCurrentWeather() {
    return fetch(weatherUrl)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            temperature.innerText = data.current.temp_c;
            weatherText.innerText = data.current.condition.text;
            feelslike.innerText = data.current.feelslike_c;
            wind.innerText = `${Math.round(data.current.wind_kph * 1000 / 60)}`;
            humidity.innerText = data.current.humidity;
            // latitudeHtml.innerText = `Latitude: ${data.location.lat}`;
            // longitudeHtml.innerText = `Longitude: ${data.location.lon}`;
            setWeatherInfo(data);
        });    
};


const city = document.getElementById('city');
const country = document.getElementById('country');

function setWeatherInfo(data) {
    city.innerText = data.location.name;
    country.innerText = data.location.country;
}

var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoibWlraXN1bSIsImEiOiJja2FvYmE0cHQwcDN0MnlwZmppNnQ4c21vIn0.hw0Slxj8zfqIGrT6TFkagw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
//   center: [27.56, 53.9],
  zoom: 11
});


function getLocation() {
const locationUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchInput.value}.json?&autocomplete=false&access_token=${mapboxgl.accessToken}`;
    return fetch(locationUrl)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            // setWeatherInfo(data);
        });    
};




// function searchCity() {
//     let searchCity = searchInput.value;
//     if (!searcCity) {
//         searchCity = 'Minsk';
//     }
// }
// function submit(event) {
//     if (event) {
//         event.preventDefault();
//     }
//     getCurrentWeather();
// }
// searchButton.addEventListener('submit', submit);
