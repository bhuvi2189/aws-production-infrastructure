// src/store/slices/favoritesSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FavoriteCity } from '../../types/weather';

interface FavoritesState {
  favorites: FavoriteCity[];
}

const loadFavorites = (): FavoriteCity[] => {
  try {
    const stored = localStorage.getItem('weather-favorites');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState: FavoritesState = {
  favorites: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<FavoriteCity>) => {
      const exists = state.favorites.some(fav => fav.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
        localStorage.setItem('weather-favorites', JSON.stringify(state.favorites));
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(fav => fav.id !== action.payload);
      localStorage.setItem('weather-favorites', JSON.stringify(state.favorites));
    },
    reorderFavorites: (state, action: PayloadAction<FavoriteCity[]>) => {
      state.favorites = action.payload;
      localStorage.setItem('weather-favorites', JSON.stringify(state.favorites));
    },
  },
});

export const { addFavorite, removeFavorite, reorderFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;