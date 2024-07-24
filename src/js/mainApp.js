const myinput = document.querySelector(".search-box-input");
const searchBtn = document.querySelector(".search-btn");
let city;

const startLoadingState = async () => {
  const dynamicData = document.querySelectorAll(".dynamic-data");

  for (let index = 0; index < dynamicData.length; index++) {
    dynamicData[index].classList.add("loading");
  }
};

const endLoadingState = async () => {
  const dynamicData = document.querySelectorAll(".dynamic-data");

  for (let index = 0; index < dynamicData.length; index++) {
    dynamicData[index].classList.remove("loading");
  }
};

// Search Function
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  city = myinput.value.trim(); 
  if (city !== "") { 
    getCountery(city);
  } else {
    alert("Please enter a city name."); 
  }
  myinput.value = null;
}); 

async function getCountery(city) {

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=d3ebc91a3d5e4300b74133048241106&q=${city}&days=3`
    );
    if (!res.ok) throw new Error("No matching location found.");
    const data = await res.json();
    startLoadingState();
    renderData(data);
    endLoadingState();
    } catch (err) {
    startLoadingState();
    console.log('Error', err);
  }
}

// Get Date Function
function getDate(dates) {
  const date = new Date(dates);
  const day = date.getDay();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = dayNames[day];
  return dayName;
}

// Render and show data Function
function renderData(data) {

const extractMonth = (dateString) => {
  const [month, day] = new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).split(' ');
  return `${day} ${month}`;
};

const dayDate = getDate(data.forecast.forecastday[0].date);
const day2Date = getDate(data.forecast.forecastday[1].date);
const day3Date = getDate(data.forecast.forecastday[2].date);
const dayMonth = extractMonth(data.forecast.forecastday[0].date);
const day2Month = extractMonth(data.forecast.forecastday[1].date);
const day3Month = extractMonth(data.forecast.forecastday[2].date);

const currentTime = new Date().getHours();
const isDaytime = currentTime >= 6 && currentTime < 18;
  
let Html = "";

// Function to create HTML for each day
const createWeatherHtml = (dayDate, dayMonth, dayData) => `
  <div class="card-heading">${dayDate} ${dayMonth}</div>
  <div class="card">
    <div class="current-weather-card">
      <img class="current-weather-icon dynamic-data" src="${isDaytime ? dayData.day.condition.icon : data.current.condition.icon}" loading="lazy"/>
      <div class="current-weather-temperature dynamic-data">
      ${isDaytime ? `${Math.floor(dayData.day.maxtemp_c)}°C` : `${Math.floor(data.current.temp_c)}°C`}
      </div>
      <div class="current-weather-description dynamic-data">
        ${isDaytime ? dayData.day.condition.text : data.current.condition.text}
      </div>
      <div class="divider"></div>
      <div class="current-location-container">
        <img src="src/img/gps.png" alt="gps-img">
        <div class="current-location dynamic-data">${data.location.name}</div>
      </div>
      <div class="current-date-container">
        <img src="src/img/date-img.png" alt="date-img">
        <div class="current-date dynamic-data">${dayDate} ${dayMonth}</div>
      </div>
    </div>
    <div class="current-weather-details-left">
      <div class="wind-speed-card weather-card">
        <img src="src/img/animated/wind-speed.svg" class="wind-speed-icon weather-icon" />
        <div class="wind-speed-details weather-details">
          <div class="wind-speed-title weather-title">Wind Speed</div>
          <div class="wind-speed-value weather-value dynamic-data">${Math.floor(dayData.day.maxwind_kph)} kph</div>
        </div>
      </div>
      <div class="pressure-card weather-card">
        <img src="src/img/animated/pressure.svg" class="pressure-icon weather-icon" />
        <div class="pressure-details weather-details">
          <div class="pressure-title weather-title">Avg Temp</div>
          <div class="pressure-value weather-value dynamic-data">${Math.floor(dayData.day.avgtemp_c)} °C</div>
        </div>
      </div>
      <div class="sunrise-card weather-card">
        <img src="src/img/animated/sunrise.svg" class="sunrise-icon weather-icon" />
        <div class="sunrise-details weather-details">
          <div class="sunrise-title weather-title">Sunrise</div>
          <div class="sunrise-value weather-value dynamic-data">${dayData.astro.sunrise}</div>
        </div>
      </div>
    </div>
    <div class="current-weather-details-right">
      <div class="humidity-card weather-card">
        <img src="src/img/animated/humidity.svg" class="humidity-icon weather-icon" />
        <div class="humidity-details weather-details">
          <div class="humidity-title weather-title">Humidity</div>
          <div class="humidity-value weather-value dynamic-data">${dayData.day.avghumidity} %</div>
        </div>
      </div>
      <div class="visibility-card weather-card">
        <img src="src/img/animated/visibility.svg" class="visibility-icon weather-icon" />
        <div class="visibility-details weather-details">
          <div class="visibility-title weather-title">Visibility</div>
          <div class="visibility-value weather-value dynamic-data">${dayData.day.avgvis_km} km</div>
        </div>
      </div>
      <div class="sunset-card weather-card">
        <img src="src/img/animated/sunset.svg" class="sunset-icon weather-icon" />
        <div class="sunset-details weather-details">
          <div class="sunset-title weather-title">Sunset</div>
          <div class="sunset-value weather-value dynamic-data">${dayData.astro.sunset}</div>
        </div>
      </div>
    </div>
  </div>
`;

// Construct HTML for three days
Html += createWeatherHtml(dayDate, dayMonth, data.forecast.forecastday[0]);
Html += createWeatherHtml(day2Date, day2Month, data.forecast.forecastday[1]);
Html += createWeatherHtml(day3Date, day3Month, data.forecast.forecastday[2]);

// Append to the container or wherever the HTML should be inserted
document.getElementById("weather-container").innerHTML = Html;

}

// Function Get Location
function myLocation() {
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(
    async function (postion) {
      const { latitude, longitude } = postion.coords;
      try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=d3ebc91a3d5e4300b74133048241106&days=3&q=${latitude},${longitude}`
      );
      if (!res.ok) throw new Error("Problem with location ");
        const data = await res.json();
        renderData(data);
        }
      catch (err) {
      console.error('Error', err);
      }
    });
  } else {
    alert("Your browser no location");
  }
}

window.onload = myLocation;

// getLocation BTN
const getLocationButton = document.querySelector(".gps-button");
getLocationButton.addEventListener('click', myLocation);


// Follow BTN
const ctaButton = document.querySelector(".cta-button");
ctaButton.addEventListener("click", () => {
  window.open("https://github.com/Saleh0987");
});