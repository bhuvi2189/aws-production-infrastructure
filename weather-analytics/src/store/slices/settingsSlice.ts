// src/store/slices/settingsSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppSettings } from '../../types/weather';

const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem('weather-settings');
    return stored ? JSON.parse(stored) : {
      isCelsius: true,
      refreshInterval: 300000, // 5 minutes
      theme: 'auto',
    };
  } catch {
    return {
      isCelsius: true,
      refreshInterval: 300000,
      theme: 'auto',
    };
  }
};

const initialState: AppSettings = loadSettings();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTemperatureUnit: (state) => {
      state.isCelsius = !state.isCelsius;
      localStorage.setItem('weather-settings', JSON.stringify(state));
    },
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
      localStorage.setItem('weather-settings', JSON.stringify(state));
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
      localStorage.setItem('weather-settings', JSON.stringify(state));
    },
  },
});

export const { toggleTemperatureUnit, setRefreshInterval, setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;