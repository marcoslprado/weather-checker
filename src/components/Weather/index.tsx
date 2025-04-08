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

  const manageImage = (description) => {
    if (description === 'few clouds' || description === 'scattered clouds') {
      return 'src/assets/few-clouds.png'
    } else if (description === 'broken clouds' || description === 'overcast clouds') {
      return 'src/assets/overcast-clouds.png'
    } else if (description === 'clear sky') {
      return 'src/assets/clear-sky.png'
    } else if (description === 'mist' || description === 'smoke' || description === 'haze' || description === 'sand,dust whirls' || description === 'fog' || description === 'sand' || description === 'dust' || description === 'volcanic ash' || description === 'squalls' || description === 'tornado') {
      return 'src/assets/mist.png'
    } else if (description.includes('snow') || description.includes('sleet')) {
      return 'src/assets/snow.png'
    } else if (description.includes('shower rain')) {
      return 'src/assets/shower-rain.png'
    } else if (description.includes('rain')) {
      return 'src/assets/rain.png'
    } else if (description.includes('drizzle')) {
      return 'src/assets/drizzle.png'
    } else {
      return 'src/assets/thunderstorm.png'
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
          <div className="result" style={{border: '3px solid black', borderRadius: '30px', height: '20rem', width: '22rem', padding: '2rem', margin: '2rem'}}>
            <h2>{weather.name}, {weather.sys?.country}</h2>
            <div className="main-data" style={{display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '2.5rem'}}>
              <img src={manageImage(weather.weather[0].description)} style={{height: '100px'}}/>
              <p>{(weather.main?.temp).toFixed(1)}°C</p>
            </div>
            <div className="max-min" style={{display: 'flex', justifyContent: 'space-around', fontSize: '1.5rem', padding: '0.5rem', fontWeight: '500'}}>
              <p>Max</p>
              <p>Min</p>
            </div>
            <div className="max-min-api" style={{display: 'flex', justifyContent: 'space-around', fontSize: '1.5rem'}}>
              <p>{(weather.main?.temp_max).toFixed(1)}°C</p>
              <p>{(weather.main?.temp_min).toFixed(1)}°C</p>
            </div>
            
            <div className="humidity-wind" style={{display: 'flex', justifyContent: 'space-around', fontSize: '1.5rem', marginRight: '1rem', padding: '0.5rem', fontWeight: '500' }}>
              <p>Humidity</p>
              <p>Wind</p>
            </div>
            <div className="humidity-wind-api" style={{display: 'flex', justifyContent: 'space-around', fontSize: '1.5rem', marginLeft: '1rem', gap: '0.5rem'}}>
              <p>{weather.main?.humidity}%</p>
              <p>{weather.wind?.speed} m/s</p>
            </div>
            <p>{weather.weather[0].description}</p>
          </div>
      )}
    </div>
  );
}