"use client";

import { type Favorite } from "@/entities/favorite";
import {
  useWeather,
  getWeatherEmoji,
  getWeatherDescription,
} from "@/entities/weather";
import { Spinner } from "@/shared/ui";
import { useFavoriteCard } from "../model";
import { getWeatherCardGradient } from "@/shared/lib";

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
    <div
      className={`group relative overflow-hidden bg-gradient-to-br ${weather ? getWeatherCardGradient(weather.current.weatherCode) : "from-white to-gray-50"} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200/50 hover:scale-[1.03] hover:-translate-y-1`}
      onClick={onClick}
    >
      {/* 빛나는 효과 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative p-6">
        {/* 헤더 - 이름 & 액션 버튼 */}
        <div className="flex items-start justify-between mb-4">
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
                className="flex-1 px-3 py-2 border-2 border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                autoFocus
              />
              <button
                onClick={handleSaveAlias}
                className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm hover:from-blue-600 hover:to-blue-700 font-medium shadow-md hover:shadow-lg transition-all"
              >
                ✓
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 font-medium transition-all"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 truncate mb-1">
                  {favorite.alias}
                </h3>
                <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {favorite.location.displayName}
                </p>
              </div>
              <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={handleEditClick}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
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
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        ) : error || !weather ? (
          <div className="text-center py-8 text-gray-500 text-sm bg-white/50 rounded-lg">
            날씨 정보를 불러올 수 없습니다
          </div>
        ) : (
          <div className="space-y-4">
            {/* 메인 날씨 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
                  {getWeatherEmoji(weather.current.weatherCode)}
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-gray-900">
                    {weather.current.temp}°
                  </div>
                  <div className="text-sm text-gray-600 font-medium mt-1">
                    {getWeatherDescription(weather.current.weatherCode)}
                  </div>
                </div>
              </div>
            </div>

            {/* 최저/최고 & 추가 정보 */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">최저</div>
                  <div className="text-lg font-bold text-blue-600">
                    {weather.daily.tempMin}°
                  </div>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">최고</div>
                  <div className="text-lg font-bold text-red-600">
                    {weather.daily.tempMax}°
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
                </svg>
                <span className="font-medium">{weather.current.humidity}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 클릭 힌트 */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}
