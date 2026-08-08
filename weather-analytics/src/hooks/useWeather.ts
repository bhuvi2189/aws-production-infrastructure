// src/hooks/useWeather.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { fetchWeatherByLocation,  fetchWeatherByCity, 
  fetchForecast, 
  searchCities, 
  clearSearchResults  } from '../store/weatherSlice';

export const useWeather = () => {
  const dispatch = useDispatch();
  const { currentWeather, forecastData, searchResults, chartData, loading, error, lastUpdated } = useSelector(
    (state: RootState) => state.weather
  );

  const getWeatherByLocation = useCallback((lat: number, lon: number) => {
    dispatch(fetchWeatherByLocation({ lat, lon }) as any);
  }, [dispatch]);

  const getWeatherByCity = useCallback((city: string) => {
    dispatch(fetchWeatherByCity(city) as any);
  }, [dispatch]);

  const getForecast = useCallback((city: string) => {
    dispatch(fetchForecast(city) as any);
  }, [dispatch]);

  const searchCitiesByQuery = useCallback((query: string) => {
    if (query.length >= 2) {
      dispatch(searchCities(query) as any);
    } else {
      dispatch(clearSearchResults());
    }
  }, [dispatch]);

  const clearSearch = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  return {
    currentWeather,
    forecastData,
    searchResults,
    chartData,
    loading,
    error,
    lastUpdated,
    getWeatherByLocation,
    getWeatherByCity,
    getForecast, // Make sure this is exported
    searchCitiesByQuery,
    clearSearch,
  };
};