import React, { useState, useEffect } from 'react'
import './page1.css'

const Page1 = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');

    // List of West Bank governorates
    const governorates = [
        'القدس',
        'رام الله والبيرة',
        'نابلس',
        'الخليل',
        'بيت لحم',
        'أريحا',
        'سلفيت',
        'قلقيلية',
        'طولكرم',
        'جنين',
        'طوباس',
        'أريحا والأغوار',
        'أريحا',
        'بيت لحم',
        'الخليل',
        'القدس',
        'جنين',
        'نابلس',
        'قلقيلية',
        'رام الله والبيرة',
        'سلفيت',
        'طوباس',
        'طولكرم',
        'أريحا والأغوار'
    ];

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

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
        // You can add additional logic here when a city is selected
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
                >
                    <option value="">-- اختر المدينة --</option>
                    {[...new Set(governorates)].sort().map((city, index) => (
                        <option key={index} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
            </div>

            {selectedCity && (
                <div className="selected-city">
                    <h2>المدينة المختارة: {selectedCity}</h2>
                    {/* Add weather information here later */}
                </div>
            )}
        </div>
    )
}

export default Page1
