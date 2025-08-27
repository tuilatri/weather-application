// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // ---- STATE MANAGEMENT ----
    let currentQuery = '';
    // Lấy ngôn ngữ từ localStorage hoặc mặc định là 'en'
    let currentLang = localStorage.getItem('weatherAppLang') || 'en';

    // ---- ELEMENTS ----
    const cityInputDesktop = document.getElementById("searchCity");
    const cityInputMobile = document.getElementById("mobileSearchCity");
    const reloadBtn = document.getElementById("reloadBtn");
    const searchSuggestions = document.getElementById('searchSuggestions');
    const mobileSearchSuggestions = document.getElementById('mobileSearchSuggestions');
    const languageSelector = document.getElementById('languageSelector');

    // ---- INITIALIZATION ----
    setRandomBackground();
    populateLanguageSelector();
    getDefaultWeather();

    // ---- FUNCTIONS ----
    function populateLanguageSelector() {
        LANGUAGES.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            languageSelector.appendChild(option);
        });
        languageSelector.value = currentLang;
    }
    
    let debounceTimeout;
    const debounce = (func, delay) => {
        return (...args) => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    function getDefaultWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    currentQuery = `${latitude},${longitude}`;
                    getWeatherData(currentQuery, currentLang);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    currentQuery = "Hanoi";
                    getWeatherData(currentQuery, currentLang);
                }
            );
        } else {
            currentQuery = "Hanoi";
            getWeatherData(currentQuery, currentLang);
        }
    }

    // ---- EVENT HANDLERS ----
    const handleInput = async (event) => {
        const query = event.target.value.trim();
        const suggestionsContainer = event.target.id === 'searchCity' ? searchSuggestions : mobileSearchSuggestions;
        if (query.length < 3) {
            clearSuggestions();
            return;
        }
        const suggestions = await getSearchSuggestions(query);
        displaySuggestions(suggestions, suggestionsContainer);
    };

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            const city = event.target.value.trim();
            if (city) {
                clearSuggestions();
                currentQuery = city;
                getWeatherData(currentQuery, currentLang);
            } else {
                displayError("Please enter a city name.");
            }
        }
    };

    const handleSuggestionClick = (event) => {
        if (event.target.classList.contains('suggestion-item')) {
            const city = event.target.dataset.locationName;
            currentQuery = city;
            getWeatherData(currentQuery, currentLang);
            cityInputDesktop.value = '';
            cityInputMobile.value = '';
            clearSuggestions();
        }
    };
    
    function handleReload(event) {
        event.preventDefault();
        location.reload();
    }
    
    function handleLanguageChange() {
        const newLang = languageSelector.value;
        currentLang = newLang;
        localStorage.setItem('weatherAppLang', newLang);
        // Nếu đã có query, fetch lại data với ngôn ngữ mới
        if(currentQuery) {
            getWeatherData(currentQuery, currentLang);
        }
    }

    // ---- EVENT LISTENERS ----
    reloadBtn.addEventListener("click", handleReload);
    languageSelector.addEventListener('change', handleLanguageChange);
    cityInputDesktop.addEventListener("input", debounce(handleInput, 300));
    cityInputMobile.addEventListener("input", debounce(handleInput, 300));
    cityInputDesktop.addEventListener("keyup", handleSearch);
    cityInputMobile.addEventListener("keyup", handleSearch);
    searchSuggestions.addEventListener('click', handleSuggestionClick);
    mobileSearchSuggestions.addEventListener('click', handleSuggestionClick);
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.search-container')) {
            clearSuggestions();
        }
    });
});