import React, { useState, useEffect } from 'react';
import './page1.css';

// Governorate to coordinates mapping (center points)
const GOVERNORATE_COORDINATES = {
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

// Cities/Villages per governorate with coordinates
// Includes comprehensive list for سلفيت and expanded lists for باقي المحافظات
const CITIES_BY_GOV = {
    'سلفيت': {
        'سلفيت': { lat: 32.0853, lon: 35.1725 },
        'بديا': { lat: 32.1147, lon: 35.0799 },
        'دير استيا': { lat: 32.1746, lon: 35.1295 },
        'كفر الديك': { lat: 32.1009, lon: 35.1054 },
        'بروقين': { lat: 32.1077, lon: 35.1277 },
        'قراوة بني حسان': { lat: 32.1596, lon: 35.0948 },
        'دير بلوط': { lat: 32.0643, lon: 35.0469 },
        'الزاوية': { lat: 32.1003, lon: 35.0385 },
        'رافات': { lat: 32.0348, lon: 35.1218 },
        'مردة': { lat: 32.1177, lon: 35.2365 },
        'كفل حارس': { lat: 32.1152, lon: 35.1714 },
        'حارس': { lat: 32.1257, lon: 35.1733 },
        'قيرة': { lat: 32.0970, lon: 35.1978 },
        'إسكاكا': { lat: 32.1093, lon: 35.1993 },
        'ياسوف': { lat: 32.1068, lon: 35.2277 },
        'فرخة': { lat: 32.0800, lon: 35.1870 },
        'سرطة': { lat: 32.1205, lon: 35.0860 },
        'مسحة': { lat: 32.1288, lon: 35.0724 },
    },
    // نابلس
    'نابلس': {
        'نابلس': { lat: 32.2222, lon: 35.2541 },
        'بيتا': { lat: 32.1600, lon: 35.2700 },
        'حوارة': { lat: 32.1700, lon: 35.2500 },
        'عصيرة الشمالية': { lat: 32.2700, lon: 35.2300 },
        'عصيرة القبلية': { lat: 32.1700, lon: 35.2300 },
        'زواتا': { lat: 32.2500, lon: 35.1900 },
        'دير شرف': { lat: 32.2400, lon: 35.1900 },
    },
    // رام الله والبيرة
    'رام الله والبيرة': {
        'رام الله': { lat: 31.9038, lon: 35.2034 },
        'البيرة': { lat: 31.9100, lon: 35.2200 },
        'بيتونيا': { lat: 31.9000, lon: 35.1600 },
        'بيرزيت': { lat: 31.9700, lon: 35.2000 },
        'سنجل': { lat: 32.0300, lon: 35.2000 },
        'المزرعة الغربية': { lat: 32.0000, lon: 35.1000 },
        'دير دبوان': { lat: 31.9100, lon: 35.2700 },
        'نعلين': { lat: 31.9400, lon: 35.0300 },
    },
    // القدس
    'القدس': {
        'القدس': { lat: 31.7767, lon: 35.2345 },
        'بيت حنينا': { lat: 31.8300, lon: 35.2100 },
        'شعفاط': { lat: 31.8200, lon: 35.2300 },
        'العيزرية': { lat: 31.7700, lon: 35.2600 },
        'أبو ديس': { lat: 31.7500, lon: 35.2600 },
        'الرام': { lat: 31.8400, lon: 35.2200 },
    },
    // الخليل
    'الخليل': {
        'الخليل': { lat: 31.5326, lon: 35.0998 },
        'حلحول': { lat: 31.5800, lon: 35.1000 },
        'دورا': { lat: 31.5100, lon: 35.0300 },
        'يطا': { lat: 31.4500, lon: 35.0600 },
        'ترقوميا': { lat: 31.6100, lon: 34.9700 },
        'السموع': { lat: 31.3900, lon: 35.0700 },
        'الظاهرية': { lat: 31.4100, lon: 34.9700 },
    },
    // بيت لحم
    'بيت لحم': {
        'بيت لحم': { lat: 31.7054, lon: 35.2026 },
        'بيت جالا': { lat: 31.7200, lon: 35.1900 },
        'بيت ساحور': { lat: 31.7000, lon: 35.2300 },
        'الدوحة': { lat: 31.7000, lon: 35.1700 },
        'الخضر': { lat: 31.6900, lon: 35.1700 },
    },
    // أريحا
    'أريحا': {
        'أريحا': { lat: 31.8578, lon: 35.4445 },
        'العوجا': { lat: 32.0000, lon: 35.4700 },
        'فصايل': { lat: 32.0200, lon: 35.4300 },
        'الجفتلك': { lat: 32.1500, lon: 35.5200 },
    },
    // أريحا والأغوار (نفس القائمة)
    'أريحا والأغوار': {
        'أريحا': { lat: 31.8578, lon: 35.4445 },
        'العوجا': { lat: 32.0000, lon: 35.4700 },
        'فصايل': { lat: 32.0200, lon: 35.4300 },
        'الجفتلك': { lat: 32.1500, lon: 35.5200 },
    },
    // قلقيلية
    'قلقيلية': {
        'قلقيلية': { lat: 32.1908, lon: 34.9706 },
        'حبلة': { lat: 32.1600, lon: 35.0000 },
        'عزون': { lat: 32.1800, lon: 35.0600 },
        'كفر ثلث': { lat: 32.1200, lon: 35.0800 },
        'جيوس': { lat: 32.2000, lon: 35.0500 },
    },
    // طولكرم
    'طولكرم': {
        'طولكرم': { lat: 32.3119, lon: 35.0269 },
        'عنبتا': { lat: 32.3100, lon: 35.1000 },
        'بلعا': { lat: 32.3400, lon: 35.1100 },
        'ذنابة': { lat: 32.3100, lon: 35.0600 },
    },
    // جنين
    'جنين': {
        'جنين': { lat: 32.4611, lon: 35.2999 },
        'قباطية': { lat: 32.4100, lon: 35.2800 },
        'يعبد': { lat: 32.4400, lon: 35.1500 },
        'سيلة الظهر': { lat: 32.3500, lon: 35.2200 },
        'عرابة': { lat: 32.4100, lon: 35.2000 },
    },
    // طوباس
    'طوباس': {
        'طوباس': { lat: 32.3214, lon: 35.3697 },
        'طمون': { lat: 32.2800, lon: 35.3700 },
        'تياسير': { lat: 32.3500, lon: 35.4100 },
        'العقبة': { lat: 32.4000, lon: 35.4300 },
    },
};

// Using Open-Meteo API which doesn't require an API key
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

const Page1 = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [selectedGovernorate, setSelectedGovernorate] = useState('');
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

    // Fetch weather data when selection changes
    useEffect(() => {
        // Prefer city weather; if not selected, fall back to governorate center
        const hasGov = !!selectedGovernorate;
        const hasCity = !!selectedCity;
        if (!hasGov && !hasCity) return;

        const fetchWeatherData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                let targetName = selectedCity || selectedGovernorate;
                let coords = null;

                if (selectedCity) {
                    const citiesMap = CITIES_BY_GOV[selectedGovernorate] || {};
                    coords = citiesMap[selectedCity] || null;
                } 

                if (!coords && selectedGovernorate) {
                    coords = GOVERNORATE_COORDINATES[selectedGovernorate] || null;
                }

                if (!coords) {
                    throw new Error('إحداثيات الموقع غير موجودة');
                }

                console.log('Fetching weather for:', targetName, coords);
                const response = await fetch(
                    `${WEATHER_API_URL}?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&timezone=auto&temperature_unit=celsius&windspeed_unit=kmh`
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
                    name: targetName
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
    }, [selectedGovernorate, selectedCity]);

    const handleGovernorateChange = (e) => {
        const gov = e.target.value;
        setSelectedGovernorate(gov);
        setSelectedCity(''); // reset city when governorate changes
        setWeatherData(null);
    };

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
                <label htmlFor="governorate">اختر المحافظة</label>
                <select 
                    id="governorate"
                    className="city-dropdown"
                    value={selectedGovernorate}
                    onChange={handleGovernorateChange}
                    disabled={loading}
                >
                    <option value="">-- اختر المحافظة --</option>
                    {Object.keys(GOVERNORATE_COORDINATES).sort().map((gov, index) => (
                        <option key={index} value={gov}>
                            {gov}
                        </option>
                    ))}
                </select>
            </div>

            {selectedGovernorate && (
                <div className="city-selector">
                    <label htmlFor="city">اختر المدينة/القرية في {selectedGovernorate}</label>
                    <select 
                        id="city"
                        className="city-dropdown"
                        value={selectedCity}
                        onChange={handleCityChange}
                        disabled={loading || !CITIES_BY_GOV[selectedGovernorate]}
                    >
                        <option value="">
                            {CITIES_BY_GOV[selectedGovernorate] ? '-- اختر المدينة/القرية --' : 'لا توجد قائمة مدن لهذه المحافظة بعد'}
                        </option>
                        {CITIES_BY_GOV[selectedGovernorate] && Object.keys(CITIES_BY_GOV[selectedGovernorate]).sort().map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>
            )}

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
                    <h2>الطقس في {selectedCity || selectedGovernorate}</h2>
                    <div className="weather-main">
                        <div className="weather-temp">
                            <img 
                                src={weatherData.weather[0].icon}
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