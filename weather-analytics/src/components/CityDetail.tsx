// src/components/Weather/CityDetailModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Sunrise, Sunset } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { FavoriteCity } from '../types/weather';
import WeatherCharts from './WeatherCharts';
import { useWeather } from '../hooks/useWeather';

interface CityDetailModalProps {
  city: FavoriteCity | null;
  isOpen: boolean;
  onClose: () => void;
}

const CityDetailModal: React.FC<CityDetailModalProps> = ({ city, isOpen, onClose }) => {
  const { forecastData, chartData } = useSelector((state: RootState) => state.weather);
  const { isCelsius } = useSelector((state: RootState) => state.settings);
  const { getForecast } = useWeather(); // Fixed: using getForecast instead of fetchForecast

  React.useEffect(() => {
    if (city && isOpen) {
      getForecast(city.name);
    }
  }, [city, isOpen, getForecast]);

  const modalStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
    backdropFilter: 'blur(20px)',
  };

  // Removed unused darkModalStyle

  if (!city) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={modalStyle}
            className="dark:bg-slate-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative flex items-center justify-between p-8 border-b border-cyan-500/20 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-3xl">
  {/* Animated background glow */}
  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-b-3xl" />
  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
  
<div className="flex items-center space-x-8 relative z-10">
  {/* Enhanced Icon Container */}
  <motion.div
    whileHover={{ scale: 1.15, rotate: 8 }}
    whileTap={{ scale: 0.9 }}
    className="relative"
  >
    {/* Outer Glow Effect */}
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl blur-lg"
    />
    
    {/* Middle Glow Layer */}
    <div className="absolute inset-1 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl blur-md opacity-70" />
    
    {/* Main Icon Container */}
    <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-cyan-300/40 backdrop-blur-sm">
      {/* Inner Glow */}
      <div className="absolute inset-2 bg-white/10 rounded-xl blur-sm" />
      
      {/* Icon with Enhanced Styling */}
      <Calendar className="h-8 w-8 text-white drop-shadow-2xl" />
    </div>
    
    {/* Floating Particles Around Icon */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          scale: [0, 1, 0],
          rotate: [0, 180, 360],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: i * 1.2
        }}
        className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full"
        style={{
          top: `${-5 + i * 10}%`,
          left: `${-5 + i * 10}%`,
        }}
      />
    ))}
  </motion.div>
  
  {/* Enhanced Text Content */}
  <div className="space-y-1">
    {/* Main Title with Multi-layer Effect */}
    <motion.div 
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative"
    >
      {/* Text Shadow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 to-blue-300/20 blur-xl transform scale-110" />
      
      {/* Main Gradient Text */}
      <h2 className="text-5xl font-black bg-gradient-to-r from-cyan-200 via-white to-blue-100 bg-clip-text text-transparent relative drop-shadow-2xl">
        {city.name}, {city.country}
      </h2>
      
      {/* Subtle Text Outline */}
      <div className="absolute inset-0 text-5xl font-black bg-gradient-to-r from-cyan-500/10 to-blue-500/10 bg-clip-text text-transparent blur-sm transform scale-105">
        {city.name}, {city.country}
      </div>
    </motion.div>
    
    {/* Enhanced Subtitle */}
    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="flex items-center space-x-4"
    >
      {/* Animated Pulse Dot */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          boxShadow: [
            '0 0 0 0 rgba(6, 182, 212, 0.7)',
            '0 0 0 10px rgba(6, 182, 212, 0)',
            '0 0 0 0 rgba(6, 182, 212, 0)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
        className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
      />
      
      {/* Subtitle Text */}
      <div className="relative">
        {/* Text Glow */}
        <div className="absolute inset-0 bg-cyan-200/10 blur-lg transform scale-110" />
        
        {/* Main Text */}
        <p className="text-xl font-bold bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent tracking-wider relative">
          Advanced Meteorological Analytics
        </p>
        
        {/* Secondary Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-cyan-300/80 font-light text-sm mt-1 tracking-wide"
        >
          Real-time weather intelligence & predictive insights
        </motion.p>
      </div>
    </motion.div>
  </div>
</div>
  
  <motion.button
    whileHover={{ scale: 1.1, rotate: 90, backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
    whileTap={{ scale: 0.9 }}
    onClick={onClose}
    className="relative p-4 rounded-2xl transition-all duration-500 border border-cyan-500/30 hover:border-cyan-400/60 bg-slate-800/40 hover:bg-cyan-500/10 group backdrop-blur-lg"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <X className="h-6 w-6 text-cyan-300 group-hover:text-white transition-colors duration-300 relative z-10" />
  </motion.button>
</div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
              {/* 7-Day Forecast */}
             {forecastData?.forecast && (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-10"
  >
   {/* Ultra Premium Header */}
<div className="relative flex items-center space-x-6 mb-10 p-8 rounded-3xl overflow-hidden group">
  {/* Animated Background Layers */}
  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
  
  {/* Animated Gradient Overlay */}
  <motion.div
    animate={{
      background: [
        'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.1) 50%, rgba(139,92,246,0.05) 100%)',
        'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(6,182,212,0.15) 50%, rgba(59,130,246,0.1) 100%)',
        'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.05) 50%, rgba(6,182,212,0.15) 100%)'
      ]
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      repeatType: "reverse"
    }}
    className="absolute inset-0"
  />
  
  {/* Floating Particles */}
  <div className="absolute inset-0">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 4 + i,
          repeat: Infinity,
          delay: i * 0.5
        }}
        className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
        style={{
          left: `${20 + i * 15}%`,
          top: `${30 + i * 10}%`
        }}
      />
    ))}
  </div>

  {/* Border Glow Effect */}
  <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
  
  {/* Main Content */}
  <div className="relative z-10 flex items-center space-x-6">
    {/* Icon Container with Enhanced Effects */}
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl blur-md opacity-50" />
      
      {/* Icon Background */}
      <div className="relative p-4 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl shadow-2xl border border-cyan-400/30">
        <Clock className="h-7 w-7 text-white drop-shadow-lg" />
      </div>
      
      {/* Inner Glow */}
      <div className="absolute inset-2 bg-cyan-400/20 rounded-xl blur-sm" />
    </motion.div>

    {/* Text Content */}
    <div className="space-y-2">
      {/* Main Title with Multi-layer Gradient */}
      <motion.h3 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-black"
      >
        <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
          7-Day Weather Forecast
        </span>
      </motion.h3>
      
      {/* Subtitle with Enhanced Styling */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center space-x-3"
      >
        <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
        <p className="text-cyan-200/90 font-medium text-lg tracking-wide drop-shadow">
          Advanced meteorological insights for <span className="text-white font-semibold">{city.name}</span>
        </p>
      </motion.div>
    </div>
  </div>

  {/* Corner Accents */}
  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-tr-3xl" />
  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-bl-3xl" />
</div>

    {/* Premium Forecast Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
      {forecastData.forecast.forecastday.map((day, index) => (
        <motion.div
          key={day.date}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative group"
        >
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
          
          {/* Main Card */}
          <div className="relative bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90 backdrop-blur-2xl rounded-2xl border border-slate-600/40 group-hover:border-cyan-400/60 p-6 text-center shadow-2xl transition-all duration-500">
            
            {/* Date - Premium Styling */}
            <div className="text-sm font-bold text-cyan-300 mb-4 tracking-wide uppercase">
              {new Date(day.date).toLocaleDateString('en-US', { 
                weekday: 'short' 
              })}
            </div>
            
            {/* Weather Icon with Glow */}
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              className="w-14 h-14 mx-auto mb-4 filter drop-shadow-2xl bg-cyan-500/10 rounded-2xl p-2"
            >
              <img
                src={`https:${day.day.condition.icon}`}
                alt={day.day.condition.text}
                className="w-full h-full"
              />
            </motion.div>
            
            {/* Temperature - Gradient Text */}
            <div className="text-2xl font-black bg-gradient-to-r from-cyan-300 via-white to-blue-300 bg-clip-text text-transparent mb-2 drop-shadow-lg">
              {Math.round(isCelsius ? day.day.avgtemp_c : day.day.avgtemp_f)}°
            </div>
            
            {/* Condition - Enhanced Readability */}
            <div className="text-xs font-medium text-slate-200 capitalize mb-4 px-2 py-1 bg-slate-700/50 rounded-full">
              {day.day.condition.text}
            </div>
            
            {/* Sunrise/Sunset - Premium Layout */}
            <div className="space-y-3 pt-4 border-t border-slate-600/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-300">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="p-1 bg-amber-500/20 rounded-lg"
                  >
                    <Sunrise className="h-3 w-3" />
                  </motion.div>
                  <span className="text-xs font-semibold">{day.astro.sunrise}</span>
                </div>
                <div className="flex items-center space-x-2 text-orange-300">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="p-1 bg-orange-500/20 rounded-lg"
                  >
                    <Sunset className="h-3 w-3" />
                  </motion.div>
                  <span className="text-xs font-semibold">{day.astro.sunset}</span>
                </div>
              </div>
              
              {/* Additional Weather Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center p-2 bg-cyan-500/10 rounded-lg">
                  <div className="font-bold text-cyan-300">{day.day.maxwind_kph}km/h</div>
                  <div className="text-cyan-200/70">Wind</div>
                </div>
                <div className="text-center p-2 bg-blue-500/10 rounded-lg">
                  <div className="font-bold text-blue-300">{day.day.avghumidity}%</div>
                  <div className="text-blue-200/70">Humidity</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
)}

              {/* Advanced Charts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <WeatherCharts data={chartData} cityName={city.name} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CityDetailModal;