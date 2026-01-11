"use client";

import { useState, useEffect } from "react";
import { LocationSearch } from "@/features/weather-search";
import { FavoriteList } from "@/features/favorite-list";
import { Spinner } from "@/shared/ui";
import { useWeatherNavigation, useCurrentLocation } from "../model";
import {
  useWeather,
  getWeatherEmoji,
  getWeatherDescription,
} from "@/entities/weather";
import { useReverseGeocode } from "@/entities/location";
import { useRouter } from "next/navigation";
import { getWeatherGradient } from "@/shared/lib";

export function WeatherDashboard() {
  const router = useRouter();
  const { handleSelectLocation, handleFavoriteCardClick, isLoadingCoords } =
    useWeatherNavigation();

  const { detectCurrentLocation, isLoading: isLoadingLocation } =
    useCurrentLocation();

  const [currentCoords, setCurrentCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  // 첫 진입시 자동으로 현재 위치 감지 (리다이렉트 없이)
  useEffect(() => {
    detectCurrentLocation((lat, lon) => {
      setCurrentCoords({ lat, lon });
    });
  }, [detectCurrentLocation]);

  // 좌표로부터 실제 주소 가져오기 (캐싱됨)
  const { data: currentAddress } = useReverseGeocode(
    currentCoords?.lat,
    currentCoords?.lon,
  );

  // 현재 위치 날씨 데이터
  const { data: currentWeather, isLoading: isLoadingWeather } = useWeather(
    currentCoords?.lat,
    currentCoords?.lon,
    currentAddress || "현재 위치",
  );

  const handleCurrentLocationClick = () => {
    if (currentCoords && currentAddress) {
      router.push(
        `/weather?lat=${currentCoords.lat}&lon=${currentCoords.lon}&name=${encodeURIComponent(currentAddress)}`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 - 애니메이션 추가 */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-5xl animate-bounce-slow">🌤️</div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              날씨
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            실시간 날씨 정보와 예보를 확인하세요
          </p>
        </div>

        {/* 현재 위치 날씨 카드 - 대폭 개선 */}
        <div className="mb-10 animate-slide-up">
          {isLoadingLocation || isLoadingWeather ? (
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Spinner size="lg" />
                  <span className="text-white text-lg font-medium animate-pulse-slow">
                    현재 위치의 날씨를 가져오는 중...
                  </span>
                </div>
              </div>
            </div>
          ) : currentWeather && currentCoords ? (
            <button
              onClick={handleCurrentLocationClick}
              className={`group relative w-full overflow-hidden bg-gradient-to-br ${getWeatherGradient(currentWeather.current.weatherCode)} rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer text-left hover:scale-[1.02] active:scale-[0.98]`}
            >
              {/* 배경 애니메이션 */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* 빛나는 효과 */}
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>

              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <svg
                      className="w-6 h-6 text-white animate-pulse-slow"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        현재 위치
                      </h2>
                      <p className="text-white/90 text-sm">
                        {currentAddress || "현재 위치"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-7xl font-extrabold text-white drop-shadow-lg">
                      {currentWeather.current.temp}°
                    </span>
                    <div className="text-white/90 text-xl">
                      <div>
                        {currentWeather.daily.tempMin}° /{" "}
                        {currentWeather.daily.tempMax}°
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-white/90">
                    <div className="text-lg font-medium">
                      {getWeatherDescription(
                        currentWeather.current.weatherCode,
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
                      </svg>
                      습도 {currentWeather.current.humidity}%
                    </div>
                  </div>
                </div>

                <div className="text-9xl drop-shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  {getWeatherEmoji(currentWeather.current.weatherCode)}
                </div>
              </div>

              {/* 하단 화살표 힌트 */}
              <div className="absolute bottom-4 right-4 text-white/70 group-hover:text-white transition-colors">
                <svg
                  className="w-6 h-6 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </button>
          ) : null}
        </div>

        {/* 검색 섹션 */}
        <div className="mb-10 animate-slide-up-delay">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">장소 검색</h2>
          </div>
          {isLoadingCoords && (
            <div className="mb-3 text-sm text-indigo-600 flex items-center bg-indigo-50 rounded-lg px-3 py-2">
              <Spinner size="sm" />
              <span className="ml-2 font-medium">좌표 조회 중...</span>
            </div>
          )}
          <LocationSearch onSelect={handleSelectLocation} />
        </div>

        {/* 즐겨찾기 목록 */}
        <div className="animate-slide-up-delay-2">
          <FavoriteList onCardClick={handleFavoriteCardClick} />
        </div>
      </div>
    </div>
  );
}
