"use client";

import { useFavorites, MAX_FAVORITES } from "@/entities/favorite";
import { FavoriteCard } from "./favorite-card";

interface FavoriteListProps {
  onCardClick: (favoriteId: string) => void;
}

export function FavoriteList({ onCardClick }: FavoriteListProps) {
  const { favorites, removeFavorite, updateAlias, isLoading } = useFavorites();

  if (isLoading) {
    return <div className="text-gray-500">로딩 중...</div>;
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <p className="text-gray-600 text-lg font-medium">
          즐겨찾기가 비어있습니다
        </p>
        <p className="text-gray-500 text-sm mt-2">
          장소를 검색하고 즐겨찾기에 추가해보세요 (최대 {MAX_FAVORITES}개)
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          즐겨찾기 ({favorites.length}/{MAX_FAVORITES})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((favorite) => (
          <FavoriteCard
            key={favorite.id}
            favorite={favorite}
            onRemove={removeFavorite}
            onUpdateAlias={updateAlias}
            onClick={() => onCardClick(favorite.id)}
          />
        ))}
      </div>
    </div>
  );
}
