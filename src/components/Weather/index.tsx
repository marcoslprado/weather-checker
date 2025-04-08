import { useState, useEffect } from "react";
import './Weather.css'

export default function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiKey = import.meta.env.VITE_APP_API_KEY;
  const [image, setImage] = useState('src/assets/clear-sky.png')

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
    <div className="weather">
      <header style={{width: '100%', display: 'flex', justifyContent: 'start'}}>
        <img src="src\assets\weather-color.png" style={{height: '50px', marginBottom: '5px'}}></img>
        <h1 style={{ margin: '5px' }}>Weather Checker</h1>
      </header>
      
      <form onSubmit={fetchWeather}>
          <input
            type="text"
            placeholder="Type a city"
            value={city}
            onChange={handleCityValue}
            style={{borderRadius: 20, padding: '10px', width: '300px', marginRight: '5px'}}
          />
          <button 
            type="submit"
            disabled={loading}
            style={{ padding: "10px 16px", borderRadius: 20, backgroundColor: '#FFD54F', border: 'none' }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
      </form>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {weather && (
          <div className="result" style={{border: '3px solid black', borderRadius: '30px', padding: '2rem', margin: '2rem'}}>
            <h2>{weather.name}, {weather.sys?.country}</h2>
            <div className="card-inside" style={{display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '2.5rem'}}>
              <img src={image} style={{height: '100px'}}/>
              <p>{(weather.main?.temp).toFixed(1)}°C</p>
            </div>
            <div className="max-min" style={{display: 'flex', justifyContent: 'space-around', fontSize: '1.5rem'}}>
              <p>Max</p>
              <p>Min</p>
            </div>
            <div className="max-min-api" style={{display: 'flex', justifyContent: 'space-around', fontSize: '1.5rem'}}>
              <p>{(weather.main?.temp_max).toFixed(1)}°C</p>
              <p>{(weather.main?.temp_min).toFixed(1)}°C</p>
            </div>
            <p>Weather: {weather.weather[0].description}</p>
            <div className="general-data" style={{display: 'flex', justifyContent: 'space-around', fontSize: '1.25rem'}}>
              <p>💧 {weather.main?.humidity}%</p>
              <p>Wind: {weather.wind?.speed} m/s</p>
            </div>
          </div>
      )}
    </div>
  );
}