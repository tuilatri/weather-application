// js/ui.js

const locationNameEl = document.getElementById("locationName");
const currentDateEl = document.getElementById("currentDate");
const temperatureValueEl = document.getElementById("temperatureValue");
const weatherTypeEl = document.getElementById("weatherType");
const currentWeatherIconEl = document.getElementById("currentWeatherIcon");
const messageEl = document.getElementById("message");
const forecastContainer = document.getElementById('forecast-container');
const searchSuggestionsEl = document.getElementById('searchSuggestions');
const mobileSearchSuggestionsEl = document.getElementById('mobileSearchSuggestions');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const favoritesList = document.getElementById('favoritesList');
const saveLocationBtn = document.getElementById('saveLocationBtn');
// (CẬP NHẬT) Lấy element icon bên trong nút lưu
const saveLocationIcon = document.getElementById('saveLocationIcon');

function formatLocalizedDate(date, lang, options) {
    try {
        return date.toLocaleDateString(lang, options);
    } catch (e) {
        console.warn(`Could not format date for language: ${lang}. Falling back to 'en-US'.`);
        return date.toLocaleDateString('en-US', options);
    }
}

function updateUI(data, lang) {
    const { location } = data;
    updateSaveButtonState(location.name);
    
    // ... Phần còn lại của hàm giữ nguyên ...
    const { current, forecast } = data;
    updateStaticText(lang);
    const today = new Date();
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    currentDateEl.textContent = formatLocalizedDate(today, lang, dateOptions);
    locationNameEl.textContent = `${location.name}, ${location.country}`;
    temperatureValueEl.innerHTML = `${Math.round(current.temp_c)}<sup>o</sup>C`;
    weatherTypeEl.textContent = current.condition.text;
    currentWeatherIconEl.src = `https:${current.condition.icon}`;
    messageEl.textContent = '';
    document.getElementById("realFeelAdditionalValue").innerHTML = `${Math.round(current.feelslike_c)}<sup>o</sup>C`;
    document.getElementById("humidityAdditionalValue").textContent = `${current.humidity}%`;
    document.getElementById("windSpeedAdditionalValue").textContent = `${current.wind_kph} km/h`;
    document.getElementById("windDirectionAdditionalValue").textContent = current.wind_dir;
    document.getElementById("visibilityAdditionalValue").textContent = `${current.vis_km} km`;
    const todayForecast = forecast.forecastday[0];
    document.getElementById("maxTemperatureAdditionalValue").innerHTML = `${Math.round(todayForecast.day.maxtemp_c)}<sup>o</sup>C`;
    document.getElementById("minTemperatureAdditionalValue").innerHTML = `${Math.round(todayForecast.day.mintemp_c)}<sup>o</sup>C`;
    document.getElementById("sunriseAdditionalValue").textContent = todayForecast.astro.sunrise;
    document.getElementById("sunsetAdditionalValue").textContent = todayForecast.astro.sunset;
    forecastContainer.innerHTML = '';
    forecast.forecastday.forEach(dayData => {
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('daily-forecast-card');
        const date = new Date(dayData.date);
        const dayOfWeek = formatLocalizedDate(date, lang, { weekday: 'short' });
        const dayOfMonth = date.getDate();
        forecastCard.innerHTML = `<p class="daily-forecast-date">${dayOfWeek} ${dayOfMonth}</p><div class="daily-forecast-logo"><img class="imgs-as-icons" src="https:${dayData.day.condition.icon}"></div><div class="max-min-temperature-daily-forecast"><span class="max-daily-forecast">${Math.round(dayData.day.maxtemp_c)}<sup>o</sup>C</span><span class="min-daily-forecast">${Math.round(dayData.day.mintemp_c)}<sup>o</sup>C</span></div><p class="weather-type-daily-forecast">${dayData.day.condition.text}</p>`;
        forecastContainer.appendChild(forecastCard);
    });
}

function toggleSidebar() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

function renderFavoritesSidebar() {
    favoritesList.innerHTML = '';
    const favorites = getFavorites();
    if (favorites.length === 0) {
        favoritesList.innerHTML = `<li class="favorite-item" data-key="noSavedLocations">No saved locations.</li>`;
        updateStaticText(localStorage.getItem('weatherAppLang') || 'en');
        return;
    }
    favorites.forEach(city => {
        const item = document.createElement('li');
        item.classList.add('favorite-item');
        item.dataset.city = city;
        // (CẬP NHẬT) Thay icon thùng rác
        item.innerHTML = `<span>${city}</span> <button class="delete-favorite-btn" data-city="${city}"><i class="fa-solid fa-trash-can"></i></button>`;
        favoritesList.appendChild(item);
    });
}

// (CẬP NHẬT) Logic thay đổi class của icon sao
function updateSaveButtonState(city) {
    if (isFavorite(city)) {
        saveLocationBtn.classList.add('saved');
        saveLocationIcon.classList.remove('fa-regular');
        saveLocationIcon.classList.add('fa-solid');
    } else {
        saveLocationBtn.classList.remove('saved');
        saveLocationIcon.classList.remove('fa-solid');
        saveLocationIcon.classList.add('fa-regular');
    }
}

// --- Dán lại code không đổi để bạn có file hoàn chỉnh ---
function formatLocalizedDate(date, lang, options) { try { return date.toLocaleDateString(lang, options); } catch (e) { console.warn(`Could not format date for language: ${lang}. Falling back to 'en-US'.`); return date.toLocaleDateString('en-US', options); } }
function showLoader() { locationNameEl.innerHTML = '<img id="loader1" src="assets/icons/loader.gif" style="width: 37.5px; height: 37.5px;">'; currentDateEl.textContent = ''; temperatureValueEl.innerHTML = '<img id="loader2" src="assets/icons/loader.gif" style="width: 37.5px; height: 37.5px;">'; weatherTypeEl.innerHTML = '<img id="loader3" src="assets/icons/loader.gif" style="width: 37.5px; height: 37.5px;">'; messageEl.textContent = ''; forecastContainer.innerHTML = ''; clearAdditionalInfo(); updateSaveButtonState(''); }
function displayError(message) { locationNameEl.textContent = 'Error'; currentDateEl.textContent = ''; temperatureValueEl.innerHTML = ''; weatherTypeEl.innerHTML = ''; currentWeatherIconEl.src = 'assets/icons/sunny.png'; messageEl.textContent = message; forecastContainer.innerHTML = ''; clearAdditionalInfo(); }
function clearAdditionalInfo() { document.getElementById("realFeelAdditionalValue").textContent = '-'; document.getElementById("humidityAdditionalValue").textContent = '-'; document.getElementById("maxTemperatureAdditionalValue").textContent = '-'; document.getElementById("minTemperatureAdditionalValue").textContent = '-'; document.getElementById("windSpeedAdditionalValue").textContent = '-'; document.getElementById("windDirectionAdditionalValue").textContent = '-'; document.getElementById("visibilityAdditionalValue").textContent = '-'; document.getElementById("sunriseAdditionalValue").textContent = '-'; document.getElementById("sunsetAdditionalValue").textContent = '-'; }
function setRandomBackground() { const backgroundsList = ["day1.jpg", "day2.jpg", "day3.jpg", "day4.jpg", "day5.jpg", "cloudy1.jpg", "cloudy2.jpg", "cloudy3.jpg", "cloudy4.jpg", "cloudy5.jpg", "night1.jpg", "night2.jpg", "night3.jpg", "night4.jpg", "night5.jpg", "rainy1.jpg", "rainy2.jpg", "rainy3.jpg", "rainy4.jpg", "rainy5.jpg"]; const randomBackground = backgroundsList[Math.floor(Math.random() * backgroundsList.length)]; document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url('assets/media/${randomBackground}')`; }
function displaySuggestions(suggestions, container) { container.innerHTML = ''; if (suggestions.length === 0) { container.classList.remove('show'); return; } suggestions.forEach(location => { const item = document.createElement('div'); item.classList.add('suggestion-item'); item.textContent = `${location.name}, ${location.region}, ${location.country}`; item.dataset.locationName = location.name; container.appendChild(item); }); container.classList.add('show'); }
function clearSuggestions() { searchSuggestionsEl.innerHTML = ''; searchSuggestionsEl.classList.remove('show'); mobileSearchSuggestionsEl.innerHTML = ''; mobileSearchSuggestionsEl.classList.remove('show'); }