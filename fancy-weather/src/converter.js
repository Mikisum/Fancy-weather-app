import domElements from './domElements';

let temperatureUnits = 'C';
function temperatureConverter(units) {
  if (units !== temperatureUnits) {
    domElements.temperatureElements.forEach((element) => {
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

function truncate(n) {
  return n > 0 ? Math.floor(n) : Math.ceil(n);
}

function getDMS(dd, longOrLat) {
  let hemisphere;
  if (/^[WE]|(?:lon)/i.test(longOrLat)) {
    if (dd < 0) {
      hemisphere = 'W';
    } else {
      hemisphere = 'E';
    }
  } else if (dd < 0) {
    hemisphere = 'S';
  } else {
    hemisphere = 'N';
  }
  const absDD = Math.abs(dd);
  const degrees = truncate(absDD);
  const minutes = truncate((absDD - degrees) * 60);
  const seconds = ((absDD - degrees - minutes / 60) * 60 ** 2).toFixed(2);

  const dmsArray = [degrees, minutes, seconds, hemisphere];
  return `${dmsArray[0]}°${dmsArray[1]}'${dmsArray[2]}" ${dmsArray[3]}`;
}

export {getDMS, temperatureConverter} ;