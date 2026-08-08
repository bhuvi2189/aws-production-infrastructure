// src/store/slices/weatherSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction} from '@reduxjs/toolkit';

import { weatherAPI } from '../services/weatherApi';
import type { SearchResult, WeatherData,ChartData } from '../types/weather';


interface WeatherState {
  currentWeather: WeatherData | null;
  forecastData: WeatherData | null;
  searchResults: SearchResult[];
  chartData: ChartData[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: WeatherState = {
  currentWeather: null,
  forecastData: null,
  searchResults: [],
  chartData: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

export const fetchWeatherByLocation = createAsyncThunk(
  'weather/fetchByLocation',
  async ({ lat, lon }: { lat: number; lon: number }) => {
    const response = await weatherAPI.getCurrentWeather(lat, lon);
    return response;
  }
);

export const fetchWeatherByCity = createAsyncThunk( // Fixed: Added this export
  'weather/fetchByCity',
  async (city: string) => {
    const response = await weatherAPI.getCurrentWeatherByCity(city);
    return response;
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async (city: string) => {
    const response = await weatherAPI.getForecast(city, 7);
    return response;
  }
);

export const searchCities = createAsyncThunk(
  'weather/searchCities',
  async (query: string) => {
    const response = await weatherAPI.searchCities(query);
    return response;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    setChartData: (state, action: PayloadAction<ChartData[]>) => {
      state.chartData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchWeatherByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      .addCase(fetchWeatherByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCity.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchWeatherByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.forecastData = action.payload;
        // Generate chart data from forecast
        if (action.payload.forecast) {
          const chartData = action.payload.forecast.forecastday.flatMap(day => 
            day.hour.slice(0, 24).map(hour => ({
              time: hour.time,
              temperature: hour.temp_c,
              humidity: hour.humidity,
              precipitation: hour.precip_mm,
              windSpeed: hour.wind_kph,
              uvIndex: hour.uv,
            }))
          );
          state.chartData = chartData.slice(0, 24); // First 24 hours
        }
      })
      .addCase(searchCities.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});

export const { clearSearchResults, clearError, setChartData } = weatherSlice.actions;
export default weatherSlice.reducer;