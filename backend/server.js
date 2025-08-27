// Import các thư viện cần thiết
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = process.env.WEATHER_API_KEY;

app.use(cors());
app.use(express.json());

// Endpoint để lấy dữ liệu thời tiết (forecast)
app.get('/weather', async (req, res) => {
    // (CẬP NHẬT) Lấy thêm tham số 'lang'
    const { city, lang } = req.query;

    if (!city) {
        return res.status(400).json({ error: 'City parameter is required' });
    }

    const langCode = lang || 'en'; // Mặc định là tiếng Anh nếu không có
    const days = 7;
    // (CẬP NHẬT) Thêm tham số &lang=${langCode} vào URL
    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}&aqi=no&alerts=no&lang=${langCode}`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching weather data:", error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 400) {
            return res.status(404).json({ error: 'City not found' });
        }
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Endpoint cho chức năng tìm kiếm gợi ý (autocomplete)
app.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }
    const apiUrl = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`;
    
    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching search data:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch search suggestions' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});