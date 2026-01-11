"use client";

import { useFavorites, MAX_FAVORITES } from "@/entities/favorite";
import { FavoriteCard } from "./favorite-card";

interface FavoriteListProps {
  onCardClick: (favoriteId: string) => void;
}

export function FavoriteList({ onCardClick }: FavoriteListProps) {
  const { favorites, removeFavorite, updateAlias, clearAll } = useFavorites();

  const handleClearAll = () => {
    if (
      confirm(
        `즐겨찾기 ${favorites.length}개를 모두 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      )
    ) {
      clearAll();
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="relative overflow-hidden text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border-2 border-dashed border-gray-300">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-6xl">☀️</div>
          <div className="absolute top-20 right-20 text-6xl">🌧️</div>
          <div className="absolute bottom-10 left-20 text-6xl">⛈️</div>
          <div className="absolute bottom-20 right-10 text-6xl">❄️</div>
        </div>

        <div className="relative">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-4 shadow-lg">
            <svg
              className="w-10 h-10 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            즐겨찾기가 비어있어요
          </h3>
          <p className="text-gray-600 mb-1">
            자주 확인하는 장소를 추가해보세요
          </p>
          <p className="text-sm text-gray-500">
            최대 {MAX_FAVORITES}개까지 추가할 수 있어요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            즐겨찾기
          </h2>
          <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-full shadow-md">
            {favorites.length}/{MAX_FAVORITES}
          </span>
        </div>
        <button
          onClick={handleClearAll}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 text-sm font-medium shadow-sm hover:shadow"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span className="hidden xs:inline">전체 삭제</span>
          <span className="xs:hidden">삭제</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite, index) => (
          <div
            key={favorite.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <FavoriteCard
              favorite={favorite}
              onRemove={removeFavorite}
              onUpdateAlias={updateAlias}
              onClick={() => onCardClick(favorite.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
