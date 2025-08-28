// js/api.js

async function getWeatherData(query, lang) {
    showLoader();
    try {
        const response = await fetch(`http://localhost:3000/weather?city=${query}&lang=${lang}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'City not found');
        }
        const data = await response.json();

        // (MỚI) Xử lý cảnh báo
        handleAlerts(data.alerts);

        // Truyền cả data và lang vào hàm updateUI
        updateUI(data, lang);
    } catch (error) {
        console.error('Error:', error);
        displayError(error.message);
    }
}

async function getSearchSuggestions(query) {
    if (query.length < 3) return [];
    try {
        const response = await fetch(`http://localhost:3000/search?query=${query}`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
}