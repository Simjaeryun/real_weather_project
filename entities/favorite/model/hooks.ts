"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Favorite } from "./types";
import { MAX_FAVORITES } from "./types";
import {
  getFavorites,
  addFavorite as addFavoriteStorage,
  removeFavorite as removeFavoriteStorage,
  updateFavoriteAlias as updateAliasStorage,
} from "../lib/storage";

/**
 * 즐겨찾기 관리 훅
 * TanStack Query로 관리하여 자동 동기화
 */
export function useFavorites() {
  const queryClient = useQueryClient();

  // localStorage의 즐겨찾기 데이터를 query로 관리
  const { data: favorites = [] } = useQuery<Favorite[]>({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    staleTime: Infinity, // localStorage 데이터는 항상 fresh
    gcTime: Infinity, // 캐시 유지
  });

  // 추가
  const addFavorite = (favorite: Favorite) => {
    if (favorites.length >= MAX_FAVORITES) {
      throw new Error(`최대 ${MAX_FAVORITES}개까지만 추가할 수 있습니다.`);
    }

    const updated = addFavoriteStorage(favorite);

    // query 데이터 즉시 업데이트 (optimistic update)
    queryClient.setQueryData(["favorites"], updated);
  };

  // 제거
  const removeFavorite = (id: string) => {
    const updated = removeFavoriteStorage(id);

    // query 데이터 즉시 업데이트
    queryClient.setQueryData(["favorites"], updated);
  };

  // 별칭 수정
  const updateAlias = (id: string, alias: string) => {
    const updated = updateAliasStorage(id, alias);

    // query 데이터 즉시 업데이트
    queryClient.setQueryData(["favorites"], updated);
  };

  // 즐겨찾기 여부 확인
  const isFavorite = (id: string) => {
    return favorites.some((f) => f.id === id);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    updateAlias,
    isFavorite,
    canAddMore: favorites.length < MAX_FAVORITES,
  };
}
