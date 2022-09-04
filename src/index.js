import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange() {
  const inputValue = input.value.trim();
  cleanCountryList();
  cleanCountryInfo();
  if (inputValue !== '') {
    fetchCountries(inputValue).then(foundData => {
      if (foundData.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (foundData.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else if (foundData.length >= 2 && foundData.length <= 10) {
        renderCountryList(foundData);
      } else if (foundData.length === 1) {
        renderOneCountry(foundData);
      }
    });
  }
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" hight="20">
         <p>${country.name.official}</p>
                </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderOneCountry(countries) {
  const markup = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="30" hight="20">
         <p>${country.name.official}</p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages).join(
              ', '
            )} </p>
                </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function cleanCountryList() {
  countryList.innerHTML = '';
}

function cleanCountryInfo() {
  countryInfo.innerHTML = '';
}
