// src/components/Weather/WeatherCard.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, MapPin, Wind, Droplets, Gauge, RefreshCw, 
  Thermometer, Sun, Calendar
} from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useSelector } from 'react-redux';
import { weatherAPI } from '../services/weatherApi';
import type { RootState } from '../store';
import type { FavoriteCity, WeatherData } from '../types/weather';

interface WeatherCardProps {
  city: FavoriteCity;
  onViewDetails: (city: FavoriteCity) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, onViewDetails }) => {
  const { removeFromFavorites } = useFavorites();
  const { isCelsius } = useSelector((state: RootState) => state.settings);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherAPI.getCurrentWeather(city.lat, city.lon);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const handleRefresh = () => {
    fetchWeather();
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 animate-pulse"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-600 rounded w-24"></div>
              <div className="h-3 bg-gray-600 rounded w-16"></div>
            </div>
          </div>
          <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-8 bg-gray-600 rounded w-20"></div>
            <div className="h-4 bg-gray-600 rounded w-16"></div>
          </div>
          <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-600 rounded-lg"></div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (error || !weatherData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 text-center"
      >
        <div className="text-red-400 mb-3">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <RefreshCw className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium">Failed to load</p>
        </div>
        <motion.button
          onClick={handleRefresh}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center space-x-1 mx-auto transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Retry</span>
        </motion.button>
      </motion.div>
    );
  }

  const { current } = weatherData;
  const temperature = isCelsius ? current.temp_c : current.temp_f;
  const feelsLike = isCelsius ? current.feelslike_c : current.feelslike_f;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="glass-card group p-6 relative overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <MapPin className="h-4 w-4 text-blue-400" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-white text-lg">
              {city.name}
            </h3>
            <span className="text-xs text-gray-300 px-2 py-1 rounded-full bg-white/10">
              {city.country}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <motion.button
            onClick={() => onViewDetails(city)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-colors"
            title="View details"
          >
            <Calendar className="h-4 w-4 text-blue-400" />
          </motion.button>
          <motion.button
            onClick={handleRefresh}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 text-gray-400" />
          </motion.button>
          <motion.button
            onClick={() => removeFromFavorites(city.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
            title="Remove from favorites"
          >
            <Heart className="h-4 w-4 text-red-400 fill-current" />
          </motion.button>
        </div>
      </div>

      {/* Current Weather */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <div className="text-5xl font-bold mb-1 bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
            {Math.round(temperature)}°{isCelsius ? 'C' : 'F'}
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-300">
            <Thermometer className="h-3 w-3" />
            <span>Feels like {Math.round(feelsLike)}°</span>
          </div>
        </div>
        
        <motion.div 
          className="text-center"
          whileHover={{ scale: 1.1 }}
        >
          <img 
            src={`https:${current.condition.icon}`} 
            alt={current.condition.text}
            className="w-16 h-16 mx-auto filter drop-shadow-lg"
          />
          <div className="text-sm font-medium text-gray-300 capitalize mt-1">
            {current.condition.text.toLowerCase()}
          </div>
        </motion.div>
      </div>

      {/* Weather Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
        {[
          { icon: Droplets, label: 'Humidity', value: `${current.humidity}%`, color: 'text-blue-400' },
          { icon: Wind, label: 'Wind', value: `${current.wind_kph} km/h`, color: 'text-green-400' },
          { icon: Gauge, label: 'Pressure', value: `${current.pressure_mb} mb`, color: 'text-purple-400' },
          { icon: Sun, label: 'UV Index', value: current.uv, color: 'text-yellow-400' },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-3 rounded-xl hover:bg-white/5 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-2 mb-1">
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
              <span className="text-sm font-medium text-gray-300">{metric.label}</span>
            </div>
            <span className="text-lg font-bold text-white">
              {metric.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Last Updated */}
      <div className="pt-4 border-t border-white/10 relative z-10">
        <div className="text-xs text-gray-400 text-center">
          Updated {new Date().toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;