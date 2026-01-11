"use client";

import { LocationSearch } from "@/features/weather-search";
import { FavoriteList } from "@/features/favorite-list";
import { Spinner, Button } from "@/shared/ui";
import { useWeatherNavigation, useCurrentLocation } from "../model";

export function WeatherDashboard() {
  const {
    handleSelectLocation,
    handleFavoriteCardClick,
    navigateToCurrentLocation,
    isLoadingCoords,
  } = useWeatherNavigation();

  const { detectCurrentLocation, isLoading: isLoadingLocation } =
    useCurrentLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🌤️ 날씨</h1>
          <p className="text-gray-600">
            장소를 검색하고 날씨 정보를 확인하세요
          </p>
        </div>

        {/* 현재 위치 버튼 */}
        <div className="mb-6">
          <Button
            onClick={() => detectCurrentLocation(navigateToCurrentLocation)}
            disabled={isLoadingLocation}
            className="w-full sm:w-auto"
          >
            {isLoadingLocation ? (
              <>
                <Spinner size="sm" />
                <span className="ml-2">위치 감지 중...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                현재 위치 날씨 보기
              </>
            )}
          </Button>
        </div>

        {/* 검색 */}
        <div className="mb-8">
          {isLoadingCoords && (
            <div className="mb-2 text-sm text-gray-600 flex items-center">
              <Spinner size="sm" />
              <span className="ml-2">좌표 조회 중...</span>
            </div>
          )}
          <LocationSearch onSelect={handleSelectLocation} />
        </div>

        {/* 즐겨찾기 목록 */}
        <FavoriteList onCardClick={handleFavoriteCardClick} />
      </div>
    </div>
  );
}
