// js/api.js

// Hàm lấy dữ liệu thời tiết chính
async function getWeatherData(query) {
    showLoader();
    try {
        const response = await fetch(`http://localhost:3000/weather?city=${query}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'City not found');
        }
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Error:', error);
        displayError(error.message);
    }
}

// Hàm lấy gợi ý tìm kiếm
async function getSearchSuggestions(query) {
    if (query.length < 3) {
        return [];
    }
    try {
        const response = await fetch(`http://localhost:3000/search?query=${query}`);
        if (!response.ok) {
            return [];
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
}