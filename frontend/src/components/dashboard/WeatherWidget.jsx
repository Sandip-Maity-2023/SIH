
import React from 'react';

const WeatherWidget = ({ location = 'Nashik' }) => {
  const weather = {
    temp: '28°C',
    condition: 'Partly Cloudy',
    humidity: '64%',
    wind: '12 km/h',
  };

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-5 rounded-xl shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">Local Harvest Advisory</span>
          <h3 className="text-xl font-bold mt-1">📍 {location}</h3>
        </div>
        <span className="text-3xl">⛅</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-emerald-500/40 pt-3 text-center">
        <div>
          <span className="block text-[10px] text-emerald-200 uppercase">Temp</span>
          <strong className="text-sm font-bold">{weather.temp}</strong>
        </div>
        <div>
          <span className="block text-[10px] text-emerald-200 uppercase">Humidity</span>
          <strong className="text-sm font-bold">{weather.humidity}</strong>
        </div>
        <div>
          <span className="block text-[10px] text-emerald-200 uppercase">Wind</span>
          <strong className="text-sm font-bold">{weather.wind}</strong>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
