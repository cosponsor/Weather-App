function getLocationFromUrl() {
    const path = window.location.pathname;
    return path === '/' ? 'London' : path.substring(1);
}

async function fetchWeather(location) {
    const encodedLocation = encodeURIComponent(location);
    const url = `https://wttr.in/${encodedLocation}?format=%C+%t+%w`;

    try {
        console.log(`Fetching from URL: ${url}`);
        const response = await fetch(url);

        if (response.status === 404) {
            throw new Error('Location not found');
        }
        if (!response.ok) {
            throw new Error('Weather data not found');
        }
        return response.text();
    } catch (error) {
        throw new Error(error.message);
    }
}

function formatWeatherData(data) {
    const parts = data.split(' ');
    const condition = parts.slice(0, -2).join(' ');
    const temperature = parts[parts.length - 2];
    const windSpeed = parts[parts.length - 1];

    return `
        <p><strong>Condition:</strong> ${condition}</p>
        <p><strong>Temperature:</strong> ${temperature}</p>
        <p><strong>Wind speed:</strong> ${windSpeed}</p>
    `;
}

function displayWeather(data) {
    const formattedData = formatWeatherData(data);
    document.getElementById('weather').innerHTML = formattedData;
    document.getElementById('location').innerHTML = decodeURIComponent(getLocationFromUrl());
}

async function init() {
    const location = getLocationFromUrl();

    try {
        const weatherData = await fetchWeather(location);
        displayWeather(weatherData);
        document.title = `weather.me | ${decodeURIComponent(getLocationFromUrl())}`;
    } catch (error) {
        document.getElementById('weather').textContent = error.message;
    }

    setInterval(async () => {
        try {
            const weatherData = await fetchWeather(location);
            displayWeather(weatherData);
        } catch (error) {
            document.getElementById('weather').textContent = error.message;
        }
    }, 300000);
}

init();
