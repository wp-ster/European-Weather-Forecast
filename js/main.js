document.addEventListener('DOMContentLoaded', () => {
    const citySelector = document.getElementById('city-selector');
    const weatherContainer = document.getElementById('weather-cards-container');
    const loadingIndicator = document.getElementById('loading-indicator');

    const cities = [
        { name: "Amsterdam, Netherlands", lat: 52.367, lon: 4.904 },
        { name: "Ankara, Turkey", lat: 39.933, lon: 32.859 },
        { name: "Athens, Greece", lat: 37.983, lon: 23.727 },
        { name: "Barcelona, Spain", lat: 41.387, lon: 2.168 },
        { name: "Belfast, Northern Ireland", lat: 54.597, lon: -5.930 },
        { name: "Berlin, Germany", lat: 52.520, lon: 13.405 },
        { name: "Bern, Switzerland", lat: 46.948, lon: 7.447 },
        { name: "Brussels, Belgium", lat: 50.847, lon: 4.357 },
        { name: "Bucharest, Romania", lat: 47.497, lon: 19.040 },
        { name: "Budapest, Hungary", lat: 59.329, lon: 18.068 },
        { name: "Copenhagen, Denmark", lat: 55.676, lon: 12.568 },
        { name: "Dublin, Ireland", lat: 53.349, lon: -6.260 },
        { name: "Edinburgh, Scotland", lat: 55.953, lon: -3.188 },
        { name: "Helsinki, Finland", lat: 60.169, lon: 24.938 },
        { name: "Lisbon, Portugal", lat: 38.722, lon: -9.139 },
        { name: "London, England", lat: 51.507, lon: -0.127 },
        { name: "Madrid, Spain", lat: 40.416, lon: -3.703 },
        { name: "Oslo, Norway", lat: 59.913, lon: 10.752 },
        { name: "Paris, France", lat: 48.856, lon: 2.352 },
        { name: "Prague, Czech Republic", lat: 50.075, lon: 14.437 },
        { name: "Reykjavík, Iceland", lat: 64.146, lon: -21.942 },
        { name: "Rome, Italy", lat: 41.902, lon: 12.496 },
        { name: "Stockholm, Sweden", lat: 59.329, lon: 18.068 },
        { name: "Vienna, Austria", lat: 48.208, lon: 16.373 },
        { name: "Warsaw, Poland", lat: 52.229, lon: 21.012 },
        { name: "Zurich, Switzerland", lat: 47.376, lon: 8.541 }
    ];

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = JSON.stringify({ lat: city.lat, lon: city.lon });
        option.textContent = city.name;
        citySelector.appendChild(option);
    });

    citySelector.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        weatherContainer.innerHTML = ''; 
        if (selectedValue) {
            const { lat, lon } = JSON.parse(selectedValue);
            getWeatherForecast(lat, lon);
        }
    });

    function getWeatherForecast(lat, lon) {
        loadingIndicator.classList.remove('hidden');
        const apiUrl = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                loadingIndicator.classList.add('hidden');
                displayWeather(data.dataseries);
            })
            .catch(error => {
                loadingIndicator.classList.add('hidden');
                weatherContainer.innerHTML = `<p style="text-align: center; color: red;">Failed to load weather data. Please try again.</p>`;
                console.error('Error fetching weather data:', error);
            });
    }

    function displayWeather(dataseries) {
        dataseries.forEach((day, index) => {
            const date = new Date(String(day.date).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

            const weatherInfo = getWeatherDetails(day.weather);

            const card = document.createElement('div');
            card.className = 'weather-card';
            card.style.animationDelay = `${index * 0.1}s`; // Staggered animation
            card.innerHTML = `
                <h3>${dayOfWeek}</h3>
                <img src="${weatherInfo.icon}" alt="${weatherInfo.description}" class="weather-icon">
                <div class="temperature">${day.temp2m.max}°C / ${day.temp2m.min}°C</div>
                <div class="weather-description">${weatherInfo.description}</div>
            `;
            weatherContainer.appendChild(card);
        });
    }

    function getWeatherDetails(weather) {
        const imagePath = 'images/';
        const details = {
            'clear': { description: 'Clear', icon: `${imagePath}clear.png` },
            'pcloudy': { description: 'Partly Cloudy', icon: `${imagePath}pcloudy.png` },
            'mcloudy': { description: 'Cloudy', icon: `${imagePath}mcloudy.png` },
            'cloudy': { description: 'Cloudy', icon: `${imagePath}cloudy.png` },
            'fog': { description: 'Fog', icon: `${imagePath}fog.png` },
            'lightrain': { description: 'Light Rain', icon: `${imagePath}lightrain.png` },
            'ishower': { description: 'Isolated Shower', icon: `${imagePath}ishower.png` },
            'oshower': { description: 'Occasional Shower', icon: `${imagePath}oshower.png` },
            'lightsnow': { description: 'Light Snow', icon: `${imagePath}lightsnow.png` },
            'rain': { description: 'Rain', icon: `${imagePath}rain.png` },
            'snow': { description: 'Snow', icon: `${imagePath}snow.png` },
            'rainsnow': { description: 'Rain & Snow', icon: `${imagePath}rainsnow.png` },
            'ts': { description: 'Thunderstorm', icon: `${imagePath}tstorm.png` },
            'tsrain': { description: 'Thunderstorm & Rain', icon: `${imagePath}tsrain.png` }
        };
        return details[weather] || { description: weather, icon: '' }; // Default fallback
    }
});
