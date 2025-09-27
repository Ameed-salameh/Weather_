import React, { useState, useEffect } from 'react';
import './page1.css';

// City to coordinates mapping for Palestinian cities
const CITY_COORDINATES = {
    'القدس': { lat: 31.7767, lon: 35.2345 },
    'رام الله والبيرة': { lat: 31.9038, lon: 35.2034 },
    'نابلس': { lat: 32.2222, lon: 35.2541 },
    'الخليل': { lat: 31.5326, lon: 35.0998 },
    'بيت لحم': { lat: 31.7054, lon: 35.2026 },
    'أريحا': { lat: 31.8578, lon: 35.4445 },
    'سلفيت': { lat: 32.0853, lon: 35.1725 },
    'قلقيلية': { lat: 32.1908, lon: 34.9706 },
    'طولكرم': { lat: 32.3119, lon: 35.0269 },
    'جنين': { lat: 32.4611, lon: 35.2999 },
    'طوباس': { lat: 32.3214, lon: 35.3697 },
    'أريحا والأغوار': { lat: 31.8578, lon: 35.4445 },
};

// Using Open-Meteo API which doesn't require an API key
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

const Page1 = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Toggle dark/light mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Apply dark/light mode class to body
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    // Fetch weather data when selectedCity changes
    useEffect(() => {
        if (!selectedCity) return;

        const fetchWeatherData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const cityCoords = CITY_COORDINATES[selectedCity];
                if (!cityCoords) {
                    throw new Error('إحداثيات المدينة غير موجودة');
                }

                console.log('Fetching weather for:', selectedCity, cityCoords);
                const response = await fetch(
                    `${WEATHER_API_URL}?latitude=${cityCoords.lat}&longitude=${cityCoords.lon}&current_weather=true&timezone=auto&temperature_unit=celsius&windspeed_unit=kmh`
                );

                const data = await response.json();
                console.log('API Response:', data);

                if (!response.ok) {
                    if (data && data.reason) {
                        throw new Error(`خطأ في الخادم: ${data.reason}`);
                    } else if (response.status === 400) {
                        throw new Error('بيانات الموقع غير صالحة');
                    } else {
                        throw new Error(`خطأ في الاستجابة: ${response.status} ${response.statusText}`);
                    }
                }

                if (!data || !data.current_weather) {
                    throw new Error('بيانات الطقس غير مكتملة');
                }

                // Format data to match our component's expectations
                const formattedData = {
                    weather: [{
                        description: getWeatherDescription(data.current_weather.weathercode),
                        icon: getWeatherIcon(data.current_weather.weathercode)
                    }],
                    main: {
                        temp: data.current_weather.temperature,
                        temp_max: data.current_weather.temperature + 2, // Approximate
                        temp_min: data.current_weather.temperature - 2, // Approximate
                        humidity: 60, // Not provided in basic response
                    },
                    wind: {
                        speed: data.current_weather.windspeed,
                    },
                    name: selectedCity
                };

                setWeatherData(formattedData);
            } catch (err) {
                console.error('Error fetching weather data:', err);
                setError(err.message || 'حدث خطأ غير متوقع في جلب بيانات الطقس');
                
                // Additional debug information
                if (err instanceof TypeError) {
                    console.error('Network error - check your internet connection');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [selectedCity]);

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
        setWeatherData(null); // Reset weather data when city changes
    };

    // Map weather codes to descriptions and icons
    const getWeatherDescription = (code) => {
        const weatherCodes = {
            0: 'صافي',
            1: 'غائم جزئياً',
            2: 'غائم جزئياً',
            3: 'غائم',
            45: 'ضباب',
            48: 'ضباب متجمد',
            51: 'رذاذ خفيف',
            53: 'رذاذ',
            55: 'رذاذ كثيف',
            56: 'رذاذ متجمد خفيف',
            57: 'رذاذ متجمد كثيف',
            61: 'مطر خفيف',
            63: 'مطر',
            65: 'مطر غزير',
            66: 'مطر متجمد خفيف',
            67: 'مطر متجمد غزير',
            71: 'ثلج خفيف',
            73: 'ثلج',
            75: 'ثلج غزير',
            77: 'حبيبات ثلج',
            80: 'زخات مطر خفيفة',
            81: 'زخات مطر',
            82: 'زخات مطر غزيرة',
            85: 'زخات ثلج خفيفة',
            86: 'زخات ثلج غزيرة',
            95: 'عاصفة رعدية',
            96: 'عاصفة رعدية مع برد خفيف',
            99: 'عاصفة رعدية مع برد غزير'
        };
        return weatherCodes[code] || 'حالة جوية غير معروفة';
    };

    // Map weather codes to icon names
    const getWeatherIcon = (code) => {
        const iconMap = {
            // Clear
            0: '01d',
            // Partly cloudy
            1: '02d',
            2: '03d',
            // Cloudy
            3: '04d',
            // Fog
            45: '50d',
            48: '50d',
            // Drizzle
            51: '09d',
            53: '09d',
            55: '09d',
            56: '13d',
            57: '13d',
            // Rain
            61: '10d',
            63: '10d',
            65: '10d',
            66: '13d',
            67: '13d',
            // Snow
            71: '13d',
            73: '13d',
            75: '13d',
            77: '13d',
            // Rain showers
            80: '09d',
            81: '09d',
            82: '09d',
            // Snow showers
            85: '13d',
            86: '13d',
            // Thunderstorm
            95: '11d',
            96: '11d',
            99: '11d'
        };
        
        const iconName = iconMap[code] || '01d';
        return `https://openweathermap.org/img/wn/${iconName}@2x.png`;
    };

    return (
        <div className={`container ${darkMode ? 'dark' : 'light'}`}>
            <div className="header">
                <h1>حالة الطقس في فلسطين</h1>
                <button 
                    onClick={toggleDarkMode} 
                    className="theme-toggle"
                    aria-label={darkMode ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
                >
                    {darkMode ? '🌞' : '🌙'}
                </button>
            </div>

            <div className="city-selector">
                <label htmlFor="city">اختر المدينة</label>
                <select 
                    id="city"
                    className="city-dropdown"
                    value={selectedCity}
                    onChange={handleCityChange}
                    disabled={loading}
                >
                    <option value="">-- اختر المدينة --</option>
                    {Object.keys(CITY_COORDINATES).sort().map((city, index) => (
                        <option key={index} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div className="weather-loading">
                    <div className="loader"></div>
                    <p>جاري تحميل بيانات الطقس...</p>
                </div>
            )}

            {error && (
                <div className="weather-error">
                    <p>⚠️ {error}</p>
                </div>
            )}

            {weatherData && !loading && !error && (
                <div className="weather-info">
                    <h2>الطقس في {selectedCity}</h2>
                    <div className="weather-main">
                        <div className="weather-temp">
                            <img 
                                src={getWeatherIcon(weatherData.weather[0].icon)} 
                                alt={weatherData.weather[0].description} 
                                className="weather-icon"
                            />
                            <span className="temp">{Math.round(weatherData.main.temp)}°C</span>
                        </div>
                        <div className="weather-details">
                            <p className="weather-description">
                                {weatherData.weather[0].description}
                            </p>
                            <div className="weather-stats">
                                <div className="stat">
                                    <span className="stat-label">الحد الأقصى:</span>
                                    <span className="stat-value">{Math.round(weatherData.main.temp_max)}°C</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">الحد الأدنى:</span>
                                    <span className="stat-value">{Math.round(weatherData.main.temp_min)}°C</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">الرطوبة:</span>
                                    <span className="stat-value">{weatherData.main.humidity}%</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">الرياح:</span>
                                    <span className="stat-value">{Math.round(weatherData.wind.speed * 3.6)} كم/ساعة</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page1;
