import { useState, useEffect } from "react";

export default function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiKey = import.meta.env.VITE_APP_API_KEY;

  // Monitora mudanças no estado weather
  useEffect(() => {
    console.log("Weather data updated:", weather);
  }, [weather]);

  const handleCityValue = (event) => {
    setCity(event.target.value);
  }

  async function fetchWeather(event) {
    event.preventDefault(); 
    if (city === '') {
      setError("Please enter a city");
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
      );
      const geoData = await geoResponse.json();
      
      if (!geoData || geoData.length === 0) {
        throw new Error("City not found");
      }

      const { lat, lon } = geoData[0];
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      const weatherData = await weatherResponse.json();

      setWeather(weatherData);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Weather Checker</h1>
      
      <form onSubmit={fetchWeather}>
        <input
          type="text"
          placeholder="Type a city"
          value={city}
          onChange={handleCityValue}
        />
        <button 
          type="submit"
          disabled={loading}
          style={{ padding: "8px 16px" }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {weather && (
        <div>
          <h2>{weather.name}, {weather.sys?.country}</h2>
          <p>Current Temperature: {weather.main?.temp}°C</p>
          <p>Max Temperature: {weather.main?.temp_max}°C      |     Min Temperature: {weather.main?.temp_min}°C</p>
          <p>Weather: {weather.weather?.[0]?.description}</p>
          <p>Humidity: {weather.main?.humidity}%</p>
          <p>Wind: {weather.wind?.speed} m/s</p>
        </div>
      )}
    </div>
  );
}