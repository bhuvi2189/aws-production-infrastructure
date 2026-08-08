// src/services/weatherApi.ts

import type { SearchResult, WeatherData } from "../types/weather";

const API_KEY = 'da7cc9b7482e49b88f393803231612';
const BASE_URL = 'https://api.weatherapi.com/v1';

class WeatherAPI {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 60000; // 1 minute

  private async fetchWithCache<T>(url: string): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(url);
    
    if (cached && now - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    this.cache.set(url, { data, timestamp: now });
    return data;
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    return this.fetchWithCache<WeatherData>(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`
    );
  }

  async getCurrentWeatherByCity(city: string): Promise<WeatherData> {
    return this.fetchWithCache<WeatherData>(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no`
    );
  }

  async getForecast(city: string, days: number = 7): Promise<WeatherData> {
    return this.fetchWithCache<WeatherData>(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${days}&aqi=no&alerts=no`
    );
  }

  async searchCities(query: string): Promise<SearchResult[]> {
    if (query.length < 2) return [];
    return this.fetchWithCache<SearchResult[]>(
      `${BASE_URL}/search.json?key=${API_KEY}&q=${query}`
    );
  }

  clearCache() {
    this.cache.clear();
  }
}

export const weatherAPI = new WeatherAPI();