// Import các thư viện cần thiết
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Để đọc file .env

// Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 3000;

// Sử dụng middleware
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // Cho phép đọc JSON từ request body

// Định nghĩa API endpoint
app.get('/weather', async (req, res) => {
    // Lấy tên thành phố từ query parameter
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City parameter is required' });
    }

    // Lấy API key từ biến môi trường
    const apiKey = process.env.WEATHER_API_KEY;
    const days = 7; // Mặc định dự báo 7 ngày
    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}&aqi=no&alerts=no`;

    try {
        // Gọi đến WeatherAPI.com
        const response = await axios.get(apiUrl);
        // Trả dữ liệu về cho frontend
        res.json(response.data);
    } catch (error) {
        // Xử lý lỗi
        console.error("Error fetching weather data:", error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 400) {
            // Lỗi từ WeatherAPI (ví dụ: không tìm thấy thành phố)
            return res.status(404).json({ error: 'City not found' });
        }
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});