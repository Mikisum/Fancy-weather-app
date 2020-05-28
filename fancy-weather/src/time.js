import months from './months.js';

const time = document.getElementById('time');
const day= document.getElementById('date');

function getTime() {
    const today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    const currentDate = today.getDate(); 
    const currentMonth = today.getUTCMonth();
    const currentDay = today.getDay();

    const currentTime = `${hours}:${minutes}:${seconds}`;
    time.innerText = currentTime;
    day.innerText = `${currentDay}, ${currentDate}`;

    
}
setInterval(getTime, 1000);

export default getTime;