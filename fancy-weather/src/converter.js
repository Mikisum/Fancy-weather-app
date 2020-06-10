import domElements from './domElements';

const temperatureUnits = {
  C: 'C',
  F: 'F',
};

const hemisphere = {
  W: 'W',
  E: 'E',
  S: 'S',
  N: 'N',
};

function temperatureConverter(units) {
  if (units !== temperatureUnits.C) {
    domElements.temperatureElements.forEach((element) => {
      const unit = element;
      if (units === temperatureUnits.F) {
        const degree = parseFloat(unit.innerText);
        unit.innerText = `${Math.round((degree * 1.8) + 32)}°`;
      } else {
        const degree = parseFloat(unit.innerText);
        unit.innerText = `${Math.round((degree - 32) / 1.8)}°`;
      }
    });
    temperatureUnits.C = units;
  }
}

function truncate(n) {
  return n > 0 ? Math.floor(n) : Math.ceil(n);
}

function getDMS(dd, longOrLat) {
  let valueHemisphere;
  if (/^[WE]|(?:lon)/i.test(longOrLat)) {
    if (dd < 0) {
      valueHemisphere = hemisphere.W;
    } else {
      valueHemisphere = hemisphere.E;
    }
  } else if (dd < 0) {
    valueHemisphere = hemisphere.S;
  } else {
    valueHemisphere = hemisphere.N;
  }
  const absDD = Math.abs(dd);
  const degrees = truncate(absDD);
  const minutes = truncate((absDD - degrees) * 60);
  const seconds = ((absDD - degrees - minutes / 60) * 60 ** 2).toFixed(2);

  const dmsArray = [degrees, minutes, seconds, valueHemisphere];
  return `${dmsArray[0]}°${dmsArray[1]}'${dmsArray[2]}" ${dmsArray[3]}`;
}

export { getDMS, temperatureConverter };
