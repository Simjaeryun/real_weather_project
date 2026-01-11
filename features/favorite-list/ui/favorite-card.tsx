"use client";

import { type Favorite } from "@/entities/favorite";
import {
  useWeather,
  getWeatherEmoji,
  getWeatherDescription,
} from "@/entities/weather";
import { Card, Spinner } from "@/shared/ui";
import { useFavoriteCard } from "../model";

interface FavoriteCardProps {
  favorite: Favorite;
  onRemove: (id: string) => void;
  onUpdateAlias: (id: string, alias: string) => void;
  onClick: () => void;
}

export function FavoriteCard({
  favorite,
  onRemove,
  onUpdateAlias,
  onClick,
}: FavoriteCardProps) {
  const {
    data: weather,
    isLoading,
    error,
  } = useWeather(favorite.location.lat, favorite.location.lon, favorite.alias);

  const {
    isEditing,
    editedAlias,
    setEditedAlias,
    handleSaveAlias,
    handleCancelEdit,
    handleRemove,
    handleEditClick,
  } = useFavoriteCard({
    initialAlias: favorite.alias,
    favoriteId: favorite.id,
    onUpdateAlias,
    onRemove,
  });

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition-all duration-200 h-full"
    >
      {/* 헤더 - 이름 & 삭제 버튼 */}
      <div className="flex items-start justify-between mb-3">
        {isEditing ? (
          <div
            className="flex-1 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={editedAlias}
              onChange={(e) => setEditedAlias(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveAlias();
                if (e.key === "Escape") handleCancelEdit();
              }}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleSaveAlias}
              className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              저장
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
            >
              취소
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {favorite.alias}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {favorite.location.displayName}
              </p>
            </div>
            <div className="flex gap-1 ml-2">
              <button
                onClick={handleEditClick}
                className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                title="이름 수정"
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
              <button
                onClick={handleRemove}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                title="삭제"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* 날씨 정보 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      ) : error || !weather ? (
        <div className="text-center py-6 text-gray-500 text-sm">
          해당 장소의 정보가 제공되지 않습니다.
        </div>
      ) : (
        <div className="flex items-center justify-between">
          {/* 온도 & 날씨 */}
          <div className="flex items-center gap-2">
            <div className="text-5xl">
              {getWeatherEmoji(weather.current.weatherCode)}
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {weather.current.temp}°
              </div>
              <div className="text-sm text-gray-600">
                {getWeatherDescription(weather.current.weatherCode)}
              </div>
            </div>
          </div>

          {/* 최저/최고 */}
          <div className="text-right">
            <div className="text-sm text-gray-600">
              최고{" "}
              <span className="font-semibold text-red-500">
                {weather.daily.tempMax}°
              </span>
            </div>
            <div className="text-sm text-gray-600">
              최저{" "}
              <span className="font-semibold text-blue-500">
                {weather.daily.tempMin}°
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
