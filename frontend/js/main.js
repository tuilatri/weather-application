// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    setRandomBackground();

    const cityInputDesktop = document.getElementById("searchCity");
    const cityInputMobile = document.getElementById("mobileSearchCity");
    const reloadBtn = document.getElementById("reloadBtn");
    const searchSuggestions = document.getElementById('searchSuggestions');
    const mobileSearchSuggestions = document.getElementById('mobileSearchSuggestions');

    let debounceTimeout;
    const debounce = (func, delay) => {
        return (...args) => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

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
                getWeatherData(city);
            } else {
                displayError("Please enter a city name.");
            }
        }
    };

    const handleSuggestionClick = (event) => {
        if (event.target.classList.contains('suggestion-item')) {
            const city = event.target.dataset.locationName;
            getWeatherData(city);
            cityInputDesktop.value = '';
            cityInputMobile.value = '';
            clearSuggestions();
        }
    };
    
    function handleReload(event) {
        event.preventDefault();
        location.reload();
    }

    reloadBtn.addEventListener("click", handleReload);
    
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

    function getDefaultWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    getWeatherData(`${latitude},${longitude}`);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    getWeatherData("Hanoi");
                }
            );
        } else {
            getWeatherData("Hanoi");
        }
    }

    getDefaultWeather();
});