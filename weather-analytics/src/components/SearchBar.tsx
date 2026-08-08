// src/components/Search/SearchBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Clock, X, Navigation, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../hooks/useWeather';
import { useFavorites } from '../hooks/useFavorites';
import type { SearchResult } from '../types/weather';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { searchResults, searchCitiesByQuery, clearSearch, getWeatherByCity } = useWeather();
  const { addToFavorites, isFavorite } = useFavorites();

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('weather-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('weather-recent-searches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search debounce effect
  useEffect(() => {
    if (query.trim().length === 0) {
      clearSearch();
      setIsSearching(false);
      return;
    }

    if (query.length < 2) {
      clearSearch();
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const debounceTimer = setTimeout(() => {
      searchCitiesByQuery(query);
      setIsSearching(false);
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
      setIsSearching(false);
    };
  }, [query, searchCitiesByQuery, clearSearch]);

  const handleCitySelect = async (city: SearchResult) => {
    try {
      // Add to favorites if not already
      if (!isFavorite(city.id)) {
        addToFavorites({
          id: city.id,
          name: city.name,
          country: city.country,
          lat: city.lat,
          lon: city.lon,
        });
      }

      // Fetch weather data for the city
      await getWeatherByCity(city.name);
      
      // Add to recent searches
      setRecentSearches(prev => {
        const filtered = prev.filter(item => item.id !== city.id);
        const updated = [city, ...filtered].slice(0, 5);
        return updated;
      });

      // Reset state
      setQuery('');
      setIsOpen(false);
      clearSearch();
      
    } catch (error) {
      console.error('Error selecting city:', error);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('weather-recent-searches');
  };

  const removeRecentSearch = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(item => item.id !== id));
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleClearInput = () => {
    setQuery('');
    clearSearch();
  };

  const shouldShowRecent = query.length === 0 && recentSearches.length > 0;
  const shouldShowResults = query.length >= 2 && searchResults.length > 0;
  const showEmptyState = query.length >= 2 && !isSearching && searchResults.length === 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="Search for a city (e.g., London, New York, Tokyo)..."
            className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white placeholder-gray-300 text-base font-light transition-all duration-300 hover:bg-white/15"
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {isSearching && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Loader className="h-4 w-4 text-blue-400 animate-spin" />
              </motion.div>
            )}
            
            {query && !isSearching && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClearInput}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                title="Clear search"
              >
                <X className="h-4 w-4 text-gray-400" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && (shouldShowRecent || shouldShowResults || showEmptyState) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Recent Searches Section */}
            {shouldShowRecent && (
              <div className="p-2 border-b border-white/10">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-300">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Recent Searches</span>
                  </div>
                  {recentSearches.length > 0 && (
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-white/5"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                <div className="space-y-1">
                  {recentSearches.map((city, index) => (
                    <motion.button
                      key={city.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleCitySelect(city)}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0 text-left">
                          <div className="font-semibold text-white truncate group-hover:text-blue-200 transition-colors">
                            {city.name}
                          </div>
                          <div className="text-sm text-gray-300 truncate">
                            {city.region && `${city.region}, `}{city.country}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {isFavorite(city.id) && (
                          <div className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                            Saved
                          </div>
                        )}
                        <button
                          onClick={(e) => removeRecentSearch(city.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all duration-200"
                          title="Remove from recent"
                        >
                          <X className="h-3 w-3 text-gray-400" />
                        </button>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results Section */}
            {shouldShowResults && (
              <div className="p-2">
                <div className="px-4 py-3">
                  <div className="text-sm text-gray-300 font-medium">
                    Search Results ({searchResults.length})
                  </div>
                </div>
                
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {searchResults.map((city, index) => (
                    <motion.button
                      key={city.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleCitySelect(city)}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <Navigation className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0 text-left">
                          <div className="font-semibold text-white truncate group-hover:text-green-200 transition-colors">
                            {city.name}
                          </div>
                          <div className="text-sm text-gray-300 truncate">
                            {city.region && `${city.region}, `}{city.country}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full hidden sm:block">
                          {city.lat.toFixed(1)}°, {city.lon.toFixed(1)}°
                        </div>
                        
                        {isFavorite(city.id) ? (
                          <div className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                            Saved
                          </div>
                        ) : (
                          <div className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">
                            Add
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {showEmptyState && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center"
              >
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">No cities found</h3>
                <p className="text-gray-300 text-sm">
                  No results found for "<span className="text-white">{query}</span>".<br />
                  Try checking the spelling or search for a different city.
                </p>
              </motion.div>
            )}

            {/* Loading State */}
            {isSearching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center"
              >
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Loader className="h-6 w-6 text-blue-400 animate-spin" />
                </div>
                <p className="text-gray-300 text-sm">
                  Searching for "<span className="text-white">{query}</span>"...
                </p>
              </motion.div>
            )}

            {/* Footer */}
            {(shouldShowRecent || shouldShowResults) && (
              <div className="p-3 border-t border-white/10 bg-white/5">
                <div className="text-xs text-gray-400 text-center">
                  💡 Tip: Search by city name, region, or country
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;