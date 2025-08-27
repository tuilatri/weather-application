// js/lang.js

const LANGUAGES = [
    { code: 'ar', name: 'Arabic' }, { code: 'bn', name: 'Bengali' },
    { code: 'bg', name: 'Bulgarian' }, { code: 'zh', name: 'Chinese Simplified' },
    { code: 'zh_tw', name: 'Chinese Traditional' }, { code: 'cs', name: 'Czech' },
    { code: 'da', name: 'Danish' }, { code: 'nl', name: 'Dutch' },
    { code: 'en', name: 'English' }, { code: 'fi', name: 'Finnish' },
    { code: 'fr', name: 'French' }, { code: 'de', name: 'German' },
    { code: 'el', name: 'Greek' }, { code: 'hi', name: 'Hindi' },
    { code: 'hu', name: 'Hungarian' }, { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' }, { code: 'jv', name: 'Javanese' },
    { code: 'ko', name: 'Korean' }, { code: 'zh_cmn', name: 'Mandarin' },
    { code: 'mr', name: 'Marathi' }, { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' }, { code: 'pa', name: 'Punjabi' },
    { code: 'ro', name: 'Romanian' }, { code: 'ru', name: 'Russian' },
    { code: 'sr', name: 'Serbian' }, { code: 'si', name: 'Sinhalese' },
    { code: 'sk', name: 'Slovak' }, { code: 'es', name: 'Spanish' },
    { code: 'sv', name: 'Swedish' }, { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' }, { code: 'tr', name: 'Turkish' },
    { code: 'uk', name: 'Ukrainian' }, { code: 'ur', name: 'Urdu' },
    { code: 'vi', name: 'Vietnamese' }, { code: 'zh_wuu', name: 'Wu (Shanghainese)' },
    { code: 'zh_hsn', name: 'Xiang' }, { code: 'zh_yue', name: 'Yue (Cantonese)' },
    { code: 'zu', name: 'Zulu' }
];

const TRANSLATIONS = {
    'en': {
        realFeel: 'Real Feel', humidity: 'Humidity', highest: 'Highest',
        lowest: 'Lowest', windSpeed: 'Wind Speed', windDirection: 'Wind Direction',
        visibility: 'Visibility', sunrise: 'Sunrise', sunset: 'Sunset',
        sevenDayForecast: '7-Day Forecast',
    },
    'vi': {
        realFeel: 'Cảm giác thực', humidity: 'Độ ẩm', highest: 'Cao nhất',
        lowest: 'Thấp nhất', windSpeed: 'Tốc độ gió', windDirection: 'Hướng gió',
        visibility: 'Tầm nhìn', sunrise: 'Mặt trời mọc', sunset: 'Mặt trời lặn',
        sevenDayForecast: 'Dự báo 7 ngày',
    },
    'es': {
        realFeel: 'Sensación real', humidity: 'Humedad', highest: 'Más alta',
        lowest: 'Más bajo', windSpeed: 'Velocidad del viento', windDirection: 'Dirección del viento',
        visibility: 'Visibilidad', sunrise: 'Amanecer', sunset: 'Atardecer',
        sevenDayForecast: 'Pronóstico de 7 días',
    },
    // Bạn có thể thêm các ngôn ngữ khác ở đây...
};

function updateStaticText(lang) {
    const langTranslations = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.dataset.key;
        if (langTranslations[key]) {
            element.textContent = langTranslations[key] + ' ';
        }
    });
}