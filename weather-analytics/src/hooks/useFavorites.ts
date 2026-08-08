// src/hooks/useFavorites.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addFavorite, removeFavorite, reorderFavorites } from '../store/slices/favoritesSlice';

import type { RootState } from '../store';
import type { FavoriteCity } from '../types/weather';

export const useFavorites = () => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state: RootState) => state.favorites);

  const addToFavorites = useCallback((city: FavoriteCity) => {
    dispatch(addFavorite(city));
  }, [dispatch]);

  const removeFromFavorites = useCallback((id: number) => {
    dispatch(removeFavorite(id));
  }, [dispatch]);

  const reorderFavoritesList = useCallback((newFavorites: FavoriteCity[]) => {
    dispatch(reorderFavorites(newFavorites));
  }, [dispatch]);

  const isFavorite = useCallback((id: number) => {
    return favorites.some(fav => fav.id === id);
  }, [favorites]);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    reorderFavoritesList,
    isFavorite,
  };
};