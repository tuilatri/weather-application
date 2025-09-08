# Interactive Weather Application

## Author
- **Ha Minh Tri**

## Overview
This project is a complete and highly interactive weather application built to provide a seamless and user-friendly experience. The application features a dynamic frontend created with vanilla JavaScript that handles the user interface and interactions. It communicates with a simple and secure Node.js (Express) backend, which acts as a proxy to safely interact with the external WeatherAPI.

<!-- Weather App Preview Image -->

## Key Project Features
This application not only displays basic weather information but also integrates many advanced features to provide a rich user experience.

- **Detailed Weather Display**: Provides real-time current weather information and a comprehensive forecast for the next 7 days.
- **Smart Search**: Automatically suggests locations as the user types, powered by a debounced search function for efficiency.
- **Geolocation**: Automatically fetches weather data based on the user’s current location on page load.
- **Multi-language Support**: Supports over 40 different languages, allowing users to choose their preferred display language.
- **Save Favorite Locations**: Uses `localStorage` to save and manage a list of favorite locations for quick access via a sidebar.
- **Unit Conversion**: Easily switch the temperature display between Celsius (°C) and Fahrenheit (°F).
- **Advanced Metrics**: Displays important indices such as Air Quality (AQI), UV Index, and the chance of rain, with helpful descriptions and color-coding for AQI levels.
- **Dynamic UI**: Features randomly changing backgrounds for a fresh look on every visit and applies smooth fade-in and number-counting animations for a polished feel.
- **Live Clock**: Includes both an analog and a digital clock that displays the user's current local time.

## Architecture and Scope
The project is divided into two main parts: the **Frontend** (client-side) and the **Backend** (server-side), which communicate with each other via a custom API.

### Frontend (Client-side)
Responsible for displaying the entire user interface and handling all user interactions.

-   `main.js`: The central file that manages the main application flow and events (search input, language selection, unit conversion, saving locations, and geolocation).
-   `ui.js`: Manages all updates to the DOM (Document Object Model), including rendering weather data, displaying loading skeleton effects, managing the favorites sidebar, and updating text based on the selected language.
-   `api.js`: Sends `fetch` requests to the backend to get weather data and search suggestions.
-   `lang.js`: Contains translation data for over 40 languages and the logic to update static text throughout the application.
-   `favorites.js`: Provides functions to add, remove, and check favorite locations stored in `localStorage`.
-   `clock.js`: Contains the logic for updating both the analog and digital clocks displayed on the interface every second.
-   `animations.js`: Includes functions for creating UI effects, such as the number-counting animation for the temperature and fade-in transitions for content blocks.

### Backend (Server-side)
Acts as a secure proxy layer between the frontend and the external WeatherAPI, protecting the sensitive API key.

-   `server.js`: Built with Node.js and Express, it creates two primary endpoints for the frontend to call.
    -   **/weather**: Receives requests from the frontend, then calls the WeatherAPI with the API key (secured on the server) to fetch detailed 7-day forecast data, including AQI and weather alerts.
    -   **/search**: Receives search input from the frontend and calls the WeatherAPI to get a list of location suggestions for the autocomplete feature.