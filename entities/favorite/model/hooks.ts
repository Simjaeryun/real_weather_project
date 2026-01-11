"use client";

import { useState, useEffect } from "react";
import type { Favorite } from "./types";
import { MAX_FAVORITES } from "./types";
import {
  getFavorites,
  addFavorite as addFavoriteStorage,
  removeFavorite as removeFavoriteStorage,
  updateFavoriteAlias as updateAliasStorage,
  isFavorite as checkIsFavorite,
} from "../lib/storage";

/**
 * 즐겨찾기 관리 훅
 * React Compiler가 자동으로 메모이제이션 처리
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드
  useEffect(() => {
    setFavorites(getFavorites());
    setIsLoading(false);
  }, []);

  // 추가
  const addFavorite = (favorite: Favorite) => {
    if (favorites.length >= MAX_FAVORITES) {
      throw new Error(`최대 ${MAX_FAVORITES}개까지만 추가할 수 있습니다.`);
    }

    const updated = addFavoriteStorage(favorite);
    setFavorites(updated);
  };

  // 제거
  const removeFavorite = (id: string) => {
    const updated = removeFavoriteStorage(id);
    setFavorites(updated);
  };

  // 별칭 수정
  const updateAlias = (id: string, alias: string) => {
    const updated = updateAliasStorage(id, alias);
    setFavorites(updated);
  };

  // 즐겨찾기 여부 확인
  const isFavorite = (id: string) => {
    return checkIsFavorite(id);
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    updateAlias,
    isFavorite,
    canAddMore: favorites.length < MAX_FAVORITES,
  };
}
