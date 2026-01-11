"use client";

import { useState, useEffect } from "react";
import { LocationSearch } from "@/features/weather-search";
import { FavoriteList } from "@/features/favorite-list";
import { Spinner, Button } from "@/shared/ui";
import { useWeatherNavigation, useCurrentLocation } from "../model";
import { useWeather, getWeatherEmoji } from "@/entities/weather";
import { reverseGeocode } from "@/entities/location";
import { useRouter } from "next/navigation";

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
  const [currentAddress, setCurrentAddress] = useState<string>("현재 위치");

  // 첫 진입시 자동으로 현재 위치 감지 (리다이렉트 없이)
  useEffect(() => {
    detectCurrentLocation((lat, lon) => {
      setCurrentCoords({ lat, lon });
      // 주소 가져오기
      reverseGeocode(lat, lon).then((address) => {
        if (address) setCurrentAddress(address);
      });
    });
  }, []);

  // 현재 위치 날씨 데이터
  const { data: currentWeather, isLoading: isLoadingWeather } = useWeather(
    currentCoords?.lat,
    currentCoords?.lon,
    currentAddress,
  );

  const handleCurrentLocationClick = () => {
    if (currentCoords) {
      router.push(
        `/weather?lat=${currentCoords.lat}&lon=${currentCoords.lon}&name=${encodeURIComponent(currentAddress)}`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🌤️ 날씨</h1>
          <p className="text-gray-600">
            현재 위치 날씨를 확인하고 즐겨찾는 장소를 추가하세요
          </p>
        </div>

        {/* 현재 위치 날씨 카드 */}
        <div className="mb-8">
          {isLoadingLocation || isLoadingWeather ? (
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-center py-8">
                <Spinner size="lg" />
                <span className="ml-3 text-gray-600">현재 위치 확인 중...</span>
              </div>
            </div>
          ) : currentWeather && currentCoords ? (
            <button
              onClick={handleCurrentLocationClick}
              className="w-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white hover:shadow-xl transition-shadow cursor-pointer text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <h2 className="text-xl font-semibold">{currentAddress}</h2>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">
                      {currentWeather.current.temp}°
                    </span>
                    <span className="text-lg opacity-90">
                      {currentWeather.daily.tempMin}° /{" "}
                      {currentWeather.daily.tempMax}°
                    </span>
                  </div>
                </div>
                <div className="text-7xl">
                  {getWeatherEmoji(currentWeather.current.weatherCode)}
                </div>
              </div>
            </button>
          ) : null}
        </div>

        {/* 검색 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            장소 검색
          </h2>
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
