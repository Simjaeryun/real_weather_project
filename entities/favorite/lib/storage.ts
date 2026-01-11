import type { Favorite } from "../model/types";

const STORAGE_KEY = "weather-favorites";

/**
 * 로컬 스토리지에서 즐겨찾기 목록 가져오기
 */
export function getFavorites(): Favorite[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    return JSON.parse(data);
  } catch (error) {
    console.error("즐겨찾기 로드 실패:", error);
    return [];
  }
}

/**
 * 로컬 스토리지에 즐겨찾기 목록 저장
 */
export function saveFavorites(favorites: Favorite[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("즐겨찾기 저장 실패:", error);
    throw new Error("즐겨찾기를 저장할 수 없습니다.");
  }
}

/**
 * 즐겨찾기 추가
 */
export function addFavorite(favorite: Favorite): Favorite[] {
  const favorites = getFavorites();

  // 중복 체크
  if (favorites.some((f) => f.id === favorite.id)) {
    throw new Error("이미 즐겨찾기에 추가된 장소입니다.");
  }

  const updated = [...favorites, favorite];
  saveFavorites(updated);
  return updated;
}

/**
 * 즐겨찾기 제거
 */
export function removeFavorite(id: string): Favorite[] {
  const favorites = getFavorites();
  const updated = favorites.filter((f) => f.id !== id);
  saveFavorites(updated);
  return updated;
}

/**
 * 즐겨찾기 별칭 수정
 */
export function updateFavoriteAlias(id: string, alias: string): Favorite[] {
  const favorites = getFavorites();
  const updated = favorites.map((f) => (f.id === id ? { ...f, alias } : f));
  saveFavorites(updated);
  return updated;
}

/**
 * 특정 장소가 즐겨찾기인지 확인
 */
export function isFavorite(id: string): boolean {
  const favorites = getFavorites();
  return favorites.some((f) => f.id === id);
}

/**
 * 즐겨찾기 전체 삭제
 */
export function clearAllFavorites(): Favorite[] {
  saveFavorites([]);
  return [];
}
