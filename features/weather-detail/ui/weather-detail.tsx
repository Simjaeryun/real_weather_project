"use client";

import { useRouter } from "next/navigation";
import {
  useWeather,
  getWeatherEmoji,
  getWeatherDescription,
} from "@/entities/weather";
import { type Location, useReverseGeocode } from "@/entities/location";
import { useFavorites } from "@/entities/favorite";
import { Spinner, Button } from "@/shared/ui";
import { getWeatherGradient, formatTime } from "@/shared/lib";

interface WeatherDetailProps {
  location: Location;
  initialAlias?: string;
}

export function WeatherDetail({ location, initialAlias }: WeatherDetailProps) {
  const router = useRouter();
  const {
    data: weather,
    isLoading,
    error,
  } = useWeather(location.lat, location.lon, location.displayName);

  // 좌표로부터 실제 주소 가져오기 (캐싱됨)
  const { data: addressFromCoords } = useReverseGeocode(
    location.lat,
    location.lon,
  );

  const { addFavorite, removeFavorite, isFavorite, canAddMore } =
    useFavorites();

  const isInFavorites = isFavorite(location.id);

  const handleToggleFavorite = () => {
    if (isInFavorites) {
      removeFavorite(location.id);
    } else {
      if (!canAddMore) {
        alert("최대 6개까지만 추가할 수 있습니다.");
        return;
      }
      addFavorite({
        id: location.id,
        location,
        alias: initialAlias || location.displayName,
        addedAt: new Date().toISOString(),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">
            날씨 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">😢</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            날씨 정보를 불러올 수 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            해당 장소의 날씨 정보를 제공하지 않습니다
          </p>
          <Button
            onClick={() => router.push("/")}
            variant="primary"
            className="shadow-lg hover:shadow-xl transition-all"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* 헤더 */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <button
            onClick={() => router.back()}
            className="mb-3 sm:mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group text-sm sm:text-base"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            뒤로가기
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 truncate">
                {addressFromCoords || location.displayName}
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="truncate">
                  {new Date(weather.updatedAt).toLocaleString("ko-KR")} 업데이트
                </span>
              </p>
            </div>
            <Button
              onClick={handleToggleFavorite}
              variant={isInFavorites ? "secondary" : "primary"}
              className="shadow-lg hover:shadow-xl transition-all text-sm sm:text-base whitespace-nowrap"
            >
              {isInFavorites ? (
                <>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="hidden xs:inline">즐겨찾기 제거</span>
                  <span className="xs:hidden">제거</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1"
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
                  <span className="hidden xs:inline">즐겨찾기 추가</span>
                  <span className="xs:hidden">추가</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 현재 날씨 - 대형 카드 */}
        <div
          className={`relative overflow-hidden bg-gradient-to-br ${getWeatherGradient(weather.current.weatherCode)} rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl mb-6 sm:mb-8 animate-slide-up`}
        >
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex-1">
                <div className="text-5xl sm:text-6xl lg:text-8xl font-extrabold mb-2 sm:mb-4 drop-shadow-2xl">
                  {weather.current.temp}°
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2 drop-shadow-lg">
                  {getWeatherDescription(weather.current.weatherCode)}
                </div>
                <div className="text-white/90 text-sm sm:text-base lg:text-lg">
                  체감온도와 비슷해요
                </div>
              </div>
              <div className="text-6xl sm:text-7xl lg:text-9xl drop-shadow-2xl animate-float ml-2">
                {getWeatherEmoji(weather.current.weatherCode)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 pt-6 sm:pt-8 border-t border-white/30">
              <div className="text-center">
                <div className="text-white/80 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">
                  최저 기온
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-lg flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-7-2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                  <span>{weather.daily.tempMin}°</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/80 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">
                  최고 기온
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-lg flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                  <span>{weather.daily.tempMax}°</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/80 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">
                  습도
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-lg flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
                  </svg>
                  <span>{weather.current.humidity}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 시간별 예보 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl mb-6 sm:mb-8 animate-slide-up-delay">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            시간대별 기온
          </h2>
          <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
            <div className="flex gap-2 sm:gap-3 lg:gap-4 pb-2">
              {weather.hourly.map((hour, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center min-w-[70px] sm:min-w-[80px] lg:min-w-[90px] p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:scale-105 sm:hover:scale-110 hover:shadow-lg cursor-pointer"
                >
                  <div className="text-xs sm:text-sm text-gray-600 font-semibold mb-1 sm:mb-2">
                    {formatTime(hour.time)}
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl my-1 sm:my-2">
                    {getWeatherEmoji(hour.weatherCode)}
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                    {hour.temp}°
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600 text-center font-medium">
                    {getWeatherDescription(hour.weatherCode)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-slide-up-delay-2">
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all sm:hover:scale-105">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-gray-600 font-medium mb-0.5 sm:mb-1">
                  풍속
                </div>
                <div className="text-3xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
                  {weather.current.windSpeed.toFixed(1)}
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">
                  m/s
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all sm:hover:scale-105">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-gray-600 font-medium mb-0.5 sm:mb-1">
                  습도
                </div>
                <div className="text-3xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
                  {weather.current.humidity}
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">
                  %
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
