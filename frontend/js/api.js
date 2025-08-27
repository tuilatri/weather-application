// js/api.js

async function getWeatherData(query) {
    showLoader(); // Hàm này từ ui.js

    try {
        // Gọi đến backend của chúng ta với query (có thể là tên thành phố hoặc tọa độ)
        const response = await fetch(`http://localhost:3000/weather?city=${query}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'City not found');
        }

        const data = await response.json();
        updateUI(data); // Hàm này từ ui.js

    } catch (error) {
        console.error('Error:', error);
        displayError(error.message); // Hàm này từ ui.js
    }
}