// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Đặt ảnh nền ngẫu nhiên
    setRandomBackground();

    // Lấy các element input
    const cityInputDesktop = document.getElementById("searchCity");
    const cityInputMobile = document.getElementById("mobileSearchCity");

    // Hàm xử lý tìm kiếm
    function handleSearch(event) {
        if (event.key === "Enter") {
            const city = event.target.value.trim();
            if (city) {
                getWeatherData(city); // Hàm này từ api.js
            } else {
                displayError("Please enter a city name."); // Hàm này từ ui.js
            }
        }
    }

    // Gắn sự kiện cho input
    cityInputDesktop.addEventListener("keyup", handleSearch);
    cityInputMobile.addEventListener("keyup", handleSearch);

    // Lấy thời tiết mặc định khi tải trang
    function getDefaultWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const query = `${latitude},${longitude}`;
                    getWeatherData(query);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    // Nếu người dùng từ chối hoặc có lỗi, lấy thời tiết Hà Nội
                    getWeatherData("Hanoi");
                }
            );
        } else {
            // Nếu trình duyệt không hỗ trợ, lấy thời tiết Hà Nội
            getWeatherData("Hanoi");
        }
    }

    // Gọi hàm để lấy thời tiết mặc định
    getDefaultWeather();
});