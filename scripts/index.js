`use strict`;
import { enableValidation, reportWrongLocation } from "./validtion.js";

const apiKey = "a9501f41e552ba542baacf04a4d35e20";

const validationObj = {
  formSelector: ".content__form",
  inputSelector: ".content__input",
  submitButtonSelector: ".content__button",
  inactiveButtonClass: "content__button_disabled",
  errorSelector: ".content__error",
  inputErrorClass: "content__input_error",
  errorActiveClass: "content__error_active",
};

const loc = document.querySelector(".content__location");
const description = document.querySelector(".content__description");
const temperature = document.querySelector(".content__temperature");
const humidity = document.querySelector(".details__percent_humidity");
const windSpeed = document.querySelector(".details__percent_wind");
const errorSpan = document.querySelector(".content__error");
const image = document.querySelector('.content__image');

const searchForm = document.querySelector(".content__form");
const searchInput = document.querySelector(".content__input");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) =>
      setData(position.coords)
    );
  } else {
    setData("Москва");
  }
}

async function setData(location) {
  let locationRequest;
  if (typeof location === "string") {
    locationRequest = `q=${location}`;
  } else {
    locationRequest = `lat=${location.latitude}&lon=${location.longitude}`;
  }
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${locationRequest}&appid=${apiKey}&units=metric&lang=ru`
    );
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}`);
    }
    const json = await response.json();
    setIcon(json.weather.at(0).id);
    loc.textContent = json.name;
    description.textContent = json.weather.at(0).description;
    temperature.textContent = `${json.main.temp}°C`;
    humidity.textContent = `${json.main.humidity}%`;
    windSpeed.textContent = `${json.wind.speed}%`;
    errorSpan.textContent = "";
    searchForm.reset();
  } catch (error) {
    reportWrongLocation(errorSpan, searchInput, validationObj);
  }
}

function setIcon(weatherId) {
  let iconName;
  if (weatherId >= 200 && weatherId <= 232) {
    iconName = 'thunderstorm';
  } else if (weatherId >= 300 && weatherId <= 321) {
    iconName = 'drizzle';
  } else if (weatherId >= 500 && weatherId <= 531) {
    iconName = 'rain';
  } else if (weatherId >= 600 && weatherId <= 622) {
    iconName = 'snow';
  } else if (weatherId >= 701 && weatherId <= 781) {
    iconName = 'atmosphere';
  } else if (weatherId === 800) {
    iconName = 'clear';
  } else if (weatherId >= 801 && weatherId <= 804) {
    iconName = 'clouds';
  }
  image.src = `./images/${iconName}.png`;
  image.alt = iconName;
}

enableValidation(validationObj);
getLocation();

searchForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  setData(searchInput.value);
});
