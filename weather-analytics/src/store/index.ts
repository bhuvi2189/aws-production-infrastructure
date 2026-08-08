// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import weatherSlice from './weatherSlice';
import favoritesSlice from './slices/favoritesSlice';
import settingsSlice from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    weather: weatherSlice,
    favorites: favoritesSlice,
    settings: settingsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;