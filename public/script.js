// sctipt.js
const cityNameEl = document.querySelector("#city-name-date");
const temperatureEl = document.querySelector("#temperature");
const humidityEl = document.querySelector("#humidity");
const windSpeedEl = document.querySelector("#wind-speed");
const forecastContainerEl = document.querySelector("#forecast-container");

const historyContainerEl = document.querySelector("#history-container");

const loaderEl = document.querySelector("#loader");
const errorContainerEl = document.querySelector("#error-container");

const searchFormEl = document.querySelector("#search-form");
const searchInputEl = document.querySelector("#search-input");

function displayCurrentWeather(data) {
  const currentDate = new Date().toLocaleDateString();
  cityNameEl.textContent = `${data.name} (${currentDate})`;

  temperatureEl.textContent = `${Math.round(data.main.temp)}`;

  humidityEl.textContent = `${data.main.humidity}`;

  windSpeedEl.textContent = `${data.wind.speed}`;
}

function displayForecast(forecastList) {
  // forecastContainerEl.innerHTML = "";

  /* Since the API provides data every 3 hours, and there are 8 three-hour intervals in a 24-hour day, jumping by 8
    effectively gives us the forecast for the same time each day.*/
  for (let i = 0; i < forecastList.length; i += 8) {
    const dailyForecast = forecastList[i];
    // console.log("Daily forecast data: ", dailyForecast);

    const card = document.createElement("div");
    card.classList.add("forecast-card");

    const date = new Date(dailyForecast.dt_txt);
    const dateE1 = document.createElement("h3");
    dateE1.textContent = date.toLocaleDateString();

    const iconCode = dailyForecast.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const iconEl = document.createElement("img");
    iconEl.setAttribute("src", iconUrl);
    iconEl.setAttribute("alt", dailyForecast.weather[0].description);

    const tempEl = document.createElement("p");
    tempEl.textContent = `Temp: ${Math.round(dailyForecast.main.temp)} °C`;

    const humidityEl = document.createElement("p");
    humidityEl.textContent = `Humidity: ${dailyForecast.main.humidity}%`;

    card.append(dateE1, iconEl, tempEl, humidityEl);
    // console.log(card);
    forecastContainerEl.append(card);
  }
}

/**
 * Reads the search history from localStorage and renders it as buttons on the page.
 */
function renderHistory() {
  // 1. Get the history from localStorage, defaulting to an empty array.
  const history = JSON.parse(localStorage.getItem("weatherHistory") || "[]");

  // 2. Clear the container's current content. This is crucial to prevent
  // duplicating buttons every time we render.
  historyContainerEl.innerHTML = "";

  // 3. Loop through the history array and create a button for each city.
  for (const city of history) {
    const historyBtn = document.createElement("button");
    historyBtn.textContent = city;
    historyBtn.classList.add("history-btn");
    historyBtn.setAttribute("data-city", city);

    historyContainerEl.append(historyBtn);
  }
}

/**
 * Saves a city to the search history in localStorage.
 * @param {string} city
 */
function saveCityToHistory(city) {
  const historyString = localStorage.getItem("weatherHistory") || "[]";

  // JSON.parse(string): Takes a JSON string and converts it back into a JavaScript object or array.
  let history = JSON.parse(historyString);

  //To avoid duplicates and keep the list fresh, we filter out any previous entry of the same city
  history = history.filter(
    (existingCity) => existingCity.toLowerCase() !== city.toLowerCase()
  );

  history.unshift(city);

  if (history.length > 10) {
    history = history.slice(0, 10);
  }

  // JSON.stringify(value): Takes a JavaScript object or array and converts it into a JSON string.
  localStorage.setItem("weatherHistory", JSON.stringify(history));

  renderHistory();
}

function resetUI() {
  cityNameEl.textContent = "";
  temperatureEl.textContent = "";
  humidityEl.textContent = "";
  windSpeedEl.textContent = "";
  forecastContainerEl.innerHTML = "";
}

renderHistory();

//Engine🚂
async function fetchWeather(city) {
  try {
    errorContainerEl.classList.add("hidden");
    resetUI();
    loaderEl.classList.remove("hidden");
    // const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    // const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(`/api/weather/${city}`);

    // const response = await fetch(currentWeather);
    // const responses = await Promise.all([
    //   fetch(currentWeatherUrl),
    //   fetch(forecastUrl),
    // ]);

    // for (const response of responses) {
    //   if (!response.ok) {
    //     throw new Error("City not found or API error.");
    //   }
    // }
    if (!response.ok) {
      // We can try to get a more specific error message from our backend's JSON response
      const errorData = await response.json();
      throw new Error(errorData.error || "An unknown error occurred.");
    }

    // const weatherData = await response.json();
    // const [currentWeather, forecast] = await Promise.all(
    //   responses.map((response) => response.json())
    // );
    const { currentWeather, forecast } = await response.json();

    displayCurrentWeather(currentWeather);
    displayForecast(forecast.list);
    // console.log(forecast);
    saveCityToHistory(currentWeather.name);
  } catch (error) {
    console.error("Faild to fetch Weather data: ", error);
    errorContainerEl.textContent =
      "Sorry, the city could not be found. Please check your spelling and try again.";
    errorContainerEl.classList.remove("hidden");
  } finally {
    loaderEl.classList.add("hidden");
  }
}
/**
 * @param {number} lat
 * @param {number} lon
 */
//Engine🚂
async function fetchWeatherByCoords(lat, lon) {
  try {
    errorContainerEl.classList.add("hidden");
    resetUI();
    loaderEl.classList.remove("hidden");
    // const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    // const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await fetch(`/api/weather/coords?lat=${lat}&lon=${lon}`);
    // const response = await fetch(currentWeather);
    // const responses = await Promise.all([
    //   fetch(currentWeatherUrl),
    //   fetch(forecastUrl),
    // ]);

    // for (const response of responses) {
    //   if (!response.ok) {
    //     throw new Error("Failed to fetch weather data by coordinates.");
    //   }
    // }
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "An unknown error occurred.");
    }

    // const weatherData = await response.json();
    // const [currentWeather, forecast] = await Promise.all(
    //   responses.map((response) => response.json())
    // );
    const { currentWeather, forecast } = await response.json();

    displayCurrentWeather(currentWeather);
    displayForecast(forecast.list);
    saveCityToHistory(currentWeather.name);
  } catch (error) {
    console.error("Faild to fetch Weather data: ", error);
    errorContainerEl.textContent =
      "Could not fetch weather for your location. Please try searching for a city manually.";
    errorContainerEl.classList.remove("hidden");
  } finally {
    loaderEl.classList.add("hidden");
  }
}

searchFormEl.addEventListener("submit", (event) => {
  event.preventDefault();

  const city = searchInputEl.value.trim();

  if (city) {
    fetchWeather(city);
    searchInputEl.value = "";
    console.log(`Input is valid. Ready to fetch weather for ${city}.`);
  } else {
    console.log("Input is empty. Please enter a city name.");
  }
  console.log(`User searched for: "${city}"`);
  console.log("Form Submitted!");
});

// We use event delegation by putting the listener on the parent container.
historyContainerEl.addEventListener("click", (event) => {
  // 1. Check if the element that was clicked is actually one of our history buttons.
  // The .matches() method checks if the element would be selected by the given CSS selector.
  if (event.target.matches(".history-btn")) {
    // 2. If it is a button, get the city name from the `data-city` attribute.
    // The `dataset` property provides easy access to all `data-*` attributes.
    // `event.target.dataset.city` corresponds to `data-city="..."`.
    const city = event.target.dataset.city;

    // 3. Trigger a new weather search using the retrieved city name.
    // This reuses our entire existing application logic!
    fetchWeather(city);
  }
});

// fetchWeather("Hubli");

// We check if the `geolocation` property exists on the `navigator` object.
if (navigator.geolocation) {
  // If the browser supports geolocation, we call getCurrentPosition.
  // This function is asynchronous and uses a callback-based API.
  // It does NOT return a Promise.
  navigator.geolocation.getCurrentPosition(
    // 1. The SUCCESS callback function.
    // This function will run ONLY if the user clicks "Allow".
    // It automatically receives a 'position' object as an argument.
    (position) => {
      // The position object contains the geographic coordinates.
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log("User location found:", { latitude, longitude });
      fetchWeatherByCoords(latitude, longitude);
    },

    // 2. The ERROR callback function.
    // This function will run ONLY if the user clicks "Block" or an error occurs.
    // It automatically receives an 'error' object as an argument.
    (error) => {
      // The error object contains a 'code' and a 'message' property.
      console.error("Error getting user location:", error.message);

      // Since we couldn't get the location, the app simply does nothing further.
      // The user can still search for a city manually. This is graceful degradation.
    }
  );
} else {
  // If it does not exist, the browser does not support this API.
  // The app will continue to work perfectly without it.
  console.log("Geolocation is not available on this browser.");
}