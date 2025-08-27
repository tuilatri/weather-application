// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Đặt ảnh nền ngẫu nhiên
    setRandomBackground();

    // Lấy các element input và button
    const cityInputDesktop = document.getElementById("searchCity");
    const cityInputMobile = document.getElementById("mobileSearchCity");
    const reloadBtn = document.getElementById("reloadBtn"); // Lấy nút reload

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

    // (MỚI) Hàm xử lý sự kiện reload
    function handleReload(event) {
        event.preventDefault(); // Ngăn hành vi mặc định của thẻ <a>
        location.reload(); // Tải lại trang
    }

    // Gắn sự kiện cho input và button
    cityInputDesktop.addEventListener("keyup", handleSearch);
    cityInputMobile.addEventListener("keyup", handleSearch);
    reloadBtn.addEventListener("click", handleReload); // Gắn sự kiện click cho nút reload

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