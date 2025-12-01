/**
 * ShoreSquad Weather Integration
 * 
 * Integrates NEA (National Environment Agency) Realtime Weather API
 * from data.gov.sg for Singapore weather forecasting
 * 
 * API Endpoints:
 * - 4-Day Forecast: https://api.data.gov.sg/v1/environment/4day-weather-forecast
 * - 24-Hour Forecast: https://api.data.gov.sg/v1/environment/24-hour-weather-forecast
 * - PSI Reading: https://api.data.gov.sg/v1/environment/psi
 */

const WeatherAPI = {
    // API endpoints
    FORECAST_4DAY: 'https://api.data.gov.sg/v1/environment/4day-weather-forecast',
    FORECAST_24HOUR: 'https://api.data.gov.sg/v1/environment/24-hour-weather-forecast',
    
    // Emoji mapping for weather conditions
    weatherEmoji: {
        'Sunny': '☀️',
        'Partly cloudy': '⛅',
        'Cloudy': '☁️',
        'Overcast': '☁️',
        'Light rain': '🌧️',
        'Moderate rain': '🌧️',
        'Heavy rain': '⛈️',
        'Thundery showers': '⛈️',
        'Thunderstorm': '⛈️',
        'Windy': '💨',
        'Fair': '☀️',
        'Hazy': '🌫️',
        'Mist': '🌫️',
        'Fog': '🌫️'
    },

    /**
     * Get weather emoji for condition
     * @param {string} condition - Weather condition string
     * @returns {string} Emoji representation
     */
    getWeatherEmoji(condition) {
        if (!condition) return '🌤️';
        
        // Check for exact match
        if (this.weatherEmoji[condition]) {
            return this.weatherEmoji[condition];
        }
        
        // Check for partial matches
        const conditionLower = condition.toLowerCase();
        for (const [key, emoji] of Object.entries(this.weatherEmoji)) {
            if (conditionLower.includes(key.toLowerCase())) {
                return emoji;
            }
        }
        
        return '🌤️'; // Default
    },

    /**
     * Fetch 4-day weather forecast from NEA API
     * @returns {Promise<Object>} Weather forecast data
     */
    async fetch4DayForecast() {
        try {
            const response = await fetch(this.FORECAST_4DAY);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Weather API Error:', error);
            throw error;
        }
    },

    /**
     * Parse and format 4-day forecast for Pasir Ris area
     * @param {Object} data - Raw API response
     * @returns {Array} Formatted forecast array
     */
    parseForecast(data) {
        if (!data.items || data.items.length === 0) {
            return [];
        }

        const forecast = data.items[0].forecast;
        const validDate = data.items[0].valid_period.start;
        
        return forecast.map((day, index) => {
            const date = new Date(validDate);
            date.setDate(date.getDate() + index);
            
            return {
                date: date,
                dayName: this.getDayName(date),
                dateStr: this.formatDate(date),
                condition: day.text,
                high: day.high ? parseInt(day.high) : 'N/A',
                low: day.low ? parseInt(day.low) : 'N/A',
                emoji: this.getWeatherEmoji(day.text),
                wind: day.wind ? `${day.wind.direction} ${day.wind.speed}` : 'N/A'
            };
        });
    },

    /**
     * Get day name from date
     * @param {Date} date - Date object
     * @returns {string} Day name (Mon, Tue, etc.)
     */
    getDayName(date) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    },

    /**
     * Format date for display
     * @param {Date} date - Date object
     * @returns {string} Formatted date (DD/MM)
     */
    formatDate(date) {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${d}/${m}`;
    }
};

/**
 * Initialize weather display
 */
async function initWeather() {
    const forecastContainer = document.getElementById('weather-forecast');
    const loadingEl = document.getElementById('weather-loading');
    const errorEl = document.getElementById('weather-error');

    try {
        // Fetch forecast data
        const data = await WeatherAPI.fetch4DayForecast();
        const forecast = WeatherAPI.parseForecast(data);

        if (!forecast || forecast.length === 0) {
            throw new Error('No forecast data available');
        }

        // Clear loading message
        loadingEl.style.display = 'none';

        // Render forecast cards
        forecastContainer.innerHTML = forecast.map(day => `
            <div class="weather-day" title="Weather: ${day.condition}">
                <div class="weather-day-name">${day.dayName}</div>
                <div class="weather-day-date">${day.dateStr}</div>
                <div class="weather-icon">${day.emoji}</div>
                <div class="weather-temp">
                    ${day.high}°C
                </div>
                <div class="weather-temp-range">
                    Low: ${day.low}°C
                </div>
                <div class="weather-condition">${day.condition}</div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Weather initialization error:', error);
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = `Unable to load weather forecast: ${error.message}. This is a real-time API call - ensure CORS is enabled or use a proxy server.`;
    }
}

// Initialize weather when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeather);
} else {
    initWeather();
}
