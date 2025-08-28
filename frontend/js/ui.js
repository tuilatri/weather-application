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
const saveLocationIcon = document.getElementById('saveLocationIcon');
const alertBanner = document.getElementById('alert-banner');
const alertText = document.getElementById('alert-text');
const aqiValueEl = document.getElementById('aqiAdditionalValue');
const uvIndexValueEl = document.getElementById('uvIndexAdditionalValue');
const rainChanceValueEl = document.getElementById('rainChanceAdditionalValue');
const mainInfoContainer = document.querySelector('.main-info-container');
const additionalsContainer = document.querySelector('.additionals-container');
const dailyForecastContainer = document.querySelector('.daily-forecast');

let currentWeatherData = null;
let currentUnit = localStorage.getItem('weatherUnit') || 'c';
let lastTemperature = null;

function updateUI(data, lang) {
    // Xóa trạng thái loading skeleton
    removeSkeletons();

    applyAnimation(locationNameEl);
    applyAnimation(mainInfoContainer);
    applyAnimation(additionalsContainer);
    applyAnimation(dailyForecastContainer);

    currentWeatherData = data;
    const { location, current, forecast } = data;

    updateSaveButtonState(location.name);
    updateStaticText(lang);

    locationNameEl.textContent = `${location.name}, ${location.country}`;
    const newTemp = Math.round(current['temp_' + currentUnit]);
    animateValue(temperatureValueEl, lastTemperature || newTemp, newTemp, 500, `°${currentUnit.toUpperCase()}`);
    lastTemperature = newTemp;
    weatherTypeEl.textContent = current.condition.text;
    currentWeatherIconEl.style.display = 'block'; // Hiện lại icon thật
    currentWeatherIconEl.src = `https:${current.condition.icon}`;
    messageEl.textContent = '';
    
    document.getElementById("humidityAdditionalValue").textContent = `${current.humidity}%`;
    document.getElementById("windSpeedAdditionalValue").textContent = `${current.wind_kph} km/h`;
    document.getElementById("visibilityAdditionalValue").textContent = `${current.vis_km} km`;

    const todayForecast = forecast.forecastday[0];
    uvIndexValueEl.textContent = `${current.uv} (${getUVDescription(current.uv, lang)})`;
    rainChanceValueEl.textContent = `${todayForecast.day.daily_chance_of_rain}%`;
    
    if (current.air_quality && current.air_quality['us-epa-index']) {
        const aqiValue = current.air_quality['us-epa-index'];
        aqiValueEl.textContent = `${aqiValue} (${getAQIDescription(aqiValue, lang)})`;
        aqiValueEl.parentElement.style.color = getAQIColor(aqiValue);
    } else {
        aqiValueEl.textContent = '-';
        aqiValueEl.parentElement.style.color = '#333';
    }

    forecastContainer.innerHTML = '';
    forecast.forecastday.forEach((dayData, index) => {
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('daily-forecast-card');
        forecastCard.dataset.index = index;
        const date = new Date(dayData.date);
        const dayOfWeek = formatLocalizedDate(date, lang, { weekday: 'short' });
        const dayOfMonth = date.getDate();
        forecastCard.innerHTML = `
            <p class="daily-forecast-date">${dayOfWeek} ${dayOfMonth}</p>
            <div class="daily-forecast-logo"><img class="imgs-as-icons" src="https:${dayData.day.condition.icon}"></div>
            <div class="max-min-temperature-daily-forecast">
                <span class="max-daily-forecast"></span> 
                <span class="min-daily-forecast"></span>
            </div>
            <p class="weather-type-daily-forecast">${dayData.day.condition.text}</p>
        `;
        forecastContainer.appendChild(forecastCard);
    });
    
    updateDetailedView(0, lang);
    forecastContainer.querySelector('.daily-forecast-card[data-index="0"]').classList.add('active');
    displayTemperatures();
}

function updateDetailedView(dayIndex, lang) {
    if (!currentWeatherData) return;
    const { forecast, current } = currentWeatherData;
    const dayData = forecast.forecastday[dayIndex];
    const unitSymbol = `°${currentUnit.toUpperCase()}`;

    const date = new Date(dayData.date);
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    currentDateEl.textContent = formatLocalizedDate(date, lang, dateOptions);
    applyAnimation(currentDateEl);

    const humidity = (dayIndex == 0) ? current.humidity : dayData.day.avghumidity;
    document.getElementById("humidityAdditionalValue").textContent = `${humidity}%`;
    document.getElementById("windSpeedAdditionalValue").textContent = `${dayData.day.maxwind_kph} km/h`;
    document.getElementById("visibilityAdditionalValue").textContent = `${dayData.day.avgvis_km} km`;
    rainChanceValueEl.textContent = `${dayData.day.daily_chance_of_rain}%`;
    uvIndexValueEl.textContent = `${dayData.day.uv} (${getUVDescription(dayData.day.uv, lang)})`;
    
    const feelslike = (dayIndex == 0) ? current['feelslike_' + currentUnit] : dayData.day['avgtemp_' + currentUnit];
    document.getElementById("realFeelAdditionalValue").innerHTML = `${Math.round(feelslike)}<sup>${unitSymbol}</sup>`;
    document.getElementById("maxTemperatureAdditionalValue").innerHTML = `${Math.round(dayData.day['maxtemp_' + currentUnit])}<sup>${unitSymbol}</sup>`;
    document.getElementById("minTemperatureAdditionalValue").innerHTML = `${Math.round(dayData.day['mintemp_' + currentUnit])}<sup>${unitSymbol}</sup>`;
}

function showLoader() {
    // Xóa nội dung cũ
    clearAdditionalInfo();
    locationNameEl.textContent = '';
    currentDateEl.textContent = '';
    temperatureValueEl.innerHTML = '';
    weatherTypeEl.textContent = '';
    currentWeatherIconEl.style.display = 'none'; // Ẩn icon thật
    messageEl.textContent = '';
    handleAlerts(null);
    updateSaveButtonState('');

    // Áp dụng skeleton classes
    locationNameEl.classList.add('skeleton', 'skeleton-text', 'long');
    currentDateEl.classList.add('skeleton', 'skeleton-text', 'short');
    temperatureValueEl.classList.add('skeleton', 'skeleton-text');
    weatherTypeEl.classList.add('skeleton', 'skeleton-text', 'short');
    currentWeatherIconEl.parentElement.classList.add('skeleton', 'skeleton-img');

    // Tạo skeleton cho 7 thẻ dự báo
    forecastContainer.innerHTML = '';
    for (let i = 0; i < 7; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.classList.add('skeleton-card');
        forecastContainer.appendChild(skeletonCard);
    }
}

function removeSkeletons() {
    document.querySelectorAll('.skeleton').forEach(el => {
        el.classList.remove('skeleton', 'skeleton-text', 'long', 'short', 'skeleton-img');
    });
    currentWeatherIconEl.parentElement.classList.remove('skeleton', 'skeleton-img');
}

function displayError(message) {
    removeSkeletons(); // Dọn dẹp skeleton trước khi hiển thị lỗi
    locationNameEl.textContent = 'Error';
    currentDateEl.textContent = '';
    temperatureValueEl.innerHTML = '';
    weatherTypeEl.innerHTML = '';
    currentWeatherIconEl.style.display = 'block';
    currentWeatherIconEl.src = 'assets/icons/sunny.png';
    messageEl.textContent = message;
    forecastContainer.innerHTML = '';
    clearAdditionalInfo();
}

// --- Các hàm còn lại giữ nguyên ---
function displayTemperatures() { if (!currentWeatherData) return; const { current, forecast } = currentWeatherData; const unitSymbol = currentUnit === 'c' ? '°C' : '°F'; const newTemp = Math.round(current['temp_' + currentUnit]); animateValue(temperatureValueEl, lastTemperature || newTemp, newTemp, 500, `°${currentUnit.toUpperCase()}`); lastTemperature = newTemp; const todayForecast = forecast.forecastday[0]; const forecastCards = document.querySelectorAll('.daily-forecast-card'); forecast.forecastday.forEach((dayData, index) => { if(forecastCards[index]) { const maxTempEl = forecastCards[index].querySelector('.max-daily-forecast'); const minTempEl = forecastCards[index].querySelector('.min-daily-forecast'); maxTempEl.innerHTML = `${Math.round(dayData.day['maxtemp_' + currentUnit])}<sup>${unitSymbol}</sup>`; minTempEl.innerHTML = `${Math.round(dayData.day['mintemp_' + currentUnit])}<sup>${unitSymbol}</sup>`; } }); }
function formatLocalizedDate(date, lang, options) { try { return date.toLocaleDateString(lang, options); } catch (e) { console.warn(`Could not format date for language: ${lang}. Falling back to 'en-US'.`); return date.toLocaleDateString('en-US', options); } }
function getUVDescription(uv, lang) { const translations = { 'en': ['Low', 'Moderate', 'High', 'Very High', 'Extreme'], 'vi': ['Thấp', 'Trung bình', 'Cao', 'Rất cao', 'Cực đoan'], }; const levels = translations[lang] || translations['en']; if (uv <= 2) return levels[0]; if (uv <= 5) return levels[1]; if (uv <= 7) return levels[2]; if (uv <= 10) return levels[3]; return levels[4]; }
function getAQIDescription(aqi, lang) { const translations = { 'en': ['', 'Good', 'Moderate', 'Unhealthy for SG', 'Unhealthy', 'Very Unhealthy', 'Hazardous'], 'vi': ['', 'Tốt', 'Trung bình', 'Không tốt cho nhóm nhạy cảm', 'Không tốt', 'Rất không tốt', 'Nguy hiểm'], }; const levels = translations[lang] || translations['en']; return levels[aqi] || 'Unknown'; }
function getAQIColor(aqi) { if (aqi === 1) return '#00e400'; if (aqi === 2) return '#e5c100'; if (aqi === 3) return '#ff7e00'; if (aqi === 4) return '#ff0000'; if (aqi === 5) return '#8f3f97'; if (aqi === 6) return '#7e0023'; return '#333'; }
function handleAlerts(alerts) { if (alerts && alerts.alert.length > 0) { alertText.textContent = alerts.alert[0].headline; alertBanner.style.display = 'flex'; } else { alertBanner.style.display = 'none'; } }
function toggleSidebar() { sidebar.classList.toggle('open'); overlay.classList.toggle('open'); }
function renderFavoritesSidebar() { favoritesList.innerHTML = ''; const favorites = getFavorites(); if (favorites.length === 0) { favoritesList.innerHTML = `<li class="favorite-item" data-key="noSavedLocations">No saved locations.</li>`; updateStaticText(localStorage.getItem('weatherAppLang') || 'en'); return; } favorites.forEach(city => { const item = document.createElement('li'); item.classList.add('favorite-item'); item.dataset.city = city; item.innerHTML = `<span>${city}</span> <button class="delete-favorite-btn" data-city="${city}"><i class="fa-solid fa-trash-can"></i></button>`; favoritesList.appendChild(item); }); }
function updateSaveButtonState(city) { if (isFavorite(city)) { saveLocationBtn.classList.add('saved'); saveLocationIcon.classList.remove('fa-regular'); saveLocationIcon.classList.add('fa-solid'); } else { saveLocationBtn.classList.remove('saved'); saveLocationIcon.classList.remove('fa-solid'); saveLocationIcon.classList.add('fa-regular'); } }
function clearAdditionalInfo() { document.getElementById("realFeelAdditionalValue").textContent = '-'; document.getElementById("humidityAdditionalValue").textContent = '-'; document.getElementById("maxTemperatureAdditionalValue").textContent = '-'; document.getElementById("minTemperatureAdditionalValue").textContent = '-'; document.getElementById("windSpeedAdditionalValue").textContent = '-'; document.getElementById("visibilityAdditionalValue").textContent = '-'; if (rainChanceValueEl) rainChanceValueEl.textContent = '-'; if (uvIndexValueEl) uvIndexValueEl.textContent = '-'; if (aqiValueEl) { aqiValueEl.textContent = '-'; aqiValueEl.parentElement.style.color = '#333'; } }
function setRandomBackground() { const backgroundsList = ["day1.jpg", "day2.jpg", "day3.jpg", "day4.jpg", "day5.jpg", "cloudy1.jpg", "cloudy2.jpg", "cloudy3.jpg", "cloudy4.jpg", "cloudy5.jpg", "night1.jpg", "night2.jpg", "night3.jpg", "night4.jpg", "night5.jpg", "rainy1.jpg", "rainy2.jpg", "rainy3.jpg", "rainy4.jpg", "rainy5.jpg"]; const randomBackground = backgroundsList[Math.floor(Math.random() * backgroundsList.length)]; document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url('assets/media/${randomBackground}')`; }
function displaySuggestions(suggestions, container) { container.innerHTML = ''; if (suggestions.length === 0) { container.classList.remove('show'); return; } suggestions.forEach(location => { const item = document.createElement('div'); item.classList.add('suggestion-item'); item.textContent = `${location.name}, ${location.region}, ${location.country}`; item.dataset.locationName = location.name; container.appendChild(item); }); container.classList.add('show'); }
function clearSuggestions() { searchSuggestionsEl.innerHTML = ''; searchSuggestionsEl.classList.remove('show'); mobileSearchSuggestionsEl.innerHTML = ''; mobileSearchSuggestionsEl.classList.remove('show'); }