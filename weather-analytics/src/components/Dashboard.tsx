// src/components/Dashboard/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Settings, RefreshCw, Cloud, CloudRain, Sun } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import { useFavorites } from '../hooks/useFavorites';
import SearchBar from '../components/SearchBar';
import CityDetailModal from './CityDetail';
import type { FavoriteCity } from '../types/weather';
import WeatherCard from './WeatherCard';

const Dashboard: React.FC = () => {
  const { favorites } = useFavorites();
  const { getWeatherByLocation, getWeatherByCity, loading } = useWeather();
  const [selectedCity, setSelectedCity] = useState<FavoriteCity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByLocation(latitude, longitude);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          getWeatherByCity('London');
        }
      );
    }
  }, [getWeatherByLocation, getWeatherByCity]);

  const handleViewDetails = (city: FavoriteCity) => {
    setSelectedCity(city);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCity(null);
  };

  // Premium animated background
  const backgroundStyle = {
    background: `
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent),
      radial-gradient(ellipse 50% 50% at -10% 20%, rgba(255, 119, 198, 0.2), transparent),
      radial-gradient(ellipse 50% 50% at 110% 20%, rgba(120, 219, 255, 0.2), transparent),
      linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)
    `,
    minHeight: '100vh'
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={backgroundStyle}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 text-blue-200/10"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cloud size={80} />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/4 text-purple-200/10"
          animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <CloudRain size={60} />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 left-1/3 text-yellow-200/10"
          animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Sun size={70} />
        </motion.div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card sticky top-0 z-40"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg glow-animation"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPin className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                  Weather Analytics
                </h1>
                <p className="text-gray-300 font-light">
                  Real-time weather insights and forecasts
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button 
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 glass rounded-xl transition-all duration-300 hover:bg-white/20"
                title="Refresh all"
              >
                <RefreshCw className="h-5 w-5 text-white" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 glass rounded-xl transition-all duration-300 hover:bg-white/20"
                title="Settings"
              >
                <Settings className="h-5 w-5 text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 relative z-10">
        {/* Search Section */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </motion.section>

        {/* Weather Grid */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {loading && favorites.length === 0 ? (
            <div className="flex justify-center items-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((city, index) => (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                >
                  <WeatherCard city={city} onViewDetails={handleViewDetails} />
                </motion.div>
              ))}
              
              {/* Add City Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: favorites.length * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card p-6 flex items-center justify-center min-h-[200px] cursor-pointer group relative overflow-hidden"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="text-center relative z-10">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Plus className="h-6 w-6 text-white" />
                  </motion.div>
                  <p className="text-gray-300 font-medium group-hover:text-white transition-colors">
                    Add City
                  </p>
                </div>
              </motion.div>
            </div>
          )}

          {favorites.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="glass-card p-8 rounded-2xl max-w-md mx-auto">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No cities added yet
                </h3>
                <p className="text-gray-300">
                  Use the search bar above to add your first city and start tracking weather!
                </p>
              </div>
            </motion.div>
          )}
        </motion.section>
      </main>

      {/* City Detail Modal */}
      <CityDetailModal
        city={selectedCity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Dashboard;