"use client";

import { useRouter } from "next/navigation";
import {
  useWeather,
  getWeatherEmoji,
  getWeatherDescription,
} from "@/entities/weather";
import { type Location } from "@/entities/location";
import { useFavorites } from "@/entities/favorite";
import { Spinner, Button } from "@/shared/ui";

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

  const { favorites, addFavorite, removeFavorite, isFavorite, canAddMore } =
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
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">
          해당 장소의 정보가 제공되지 않습니다.
        </p>
        <Button
          onClick={() => router.push("/")}
          variant="secondary"
          className="mt-4"
        >
          홈으로
        </Button>
      </div>
    );
  }

  // 시간 포맷팅
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.getHours().toString().padStart(2, "0") + "시";
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <button
            onClick={() => router.back()}
            className="mb-2 text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <svg
              className="w-5 h-5"
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
            뒤로
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {location.displayName}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(weather.updatedAt).toLocaleString("ko-KR")} 업데이트
          </p>
        </div>
        <Button
          onClick={handleToggleFavorite}
          variant={isInFavorites ? "secondary" : "primary"}
        >
          {isInFavorites ? "★ 즐겨찾기 제거" : "☆ 즐겨찾기 추가"}
        </Button>
      </div>

      {/* 현재 날씨 - 큰 카드 */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-6xl font-bold mb-2">
              {weather.current.temp}°
            </div>
            <div className="text-xl mb-1">
              {getWeatherDescription(weather.current.weatherCode)}
            </div>
          </div>
          <div className="text-8xl">
            {getWeatherEmoji(weather.current.weatherCode)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-400">
          <div>
            <div className="text-blue-100 text-sm">최저 기온</div>
            <div className="text-2xl font-semibold">
              {weather.daily.tempMin}°
            </div>
          </div>
          <div>
            <div className="text-blue-100 text-sm">최고 기온</div>
            <div className="text-2xl font-semibold">
              {weather.daily.tempMax}°
            </div>
          </div>
          <div>
            <div className="text-blue-100 text-sm">습도</div>
            <div className="text-2xl font-semibold">
              {weather.current.humidity}%
            </div>
          </div>
        </div>
      </div>

      {/* 시간별 예보 */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">시간대별 기온</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-2">
            {weather.hourly.map((hour, index) => (
              <div
                key={index}
                className="flex flex-col items-center min-w-[70px] p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="text-sm text-gray-600 font-medium">
                  {formatTime(hour.time)}
                </div>
                <div className="text-3xl my-1">
                  {getWeatherEmoji(hour.weatherCode)}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {hour.temp}°
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">
                  {getWeatherDescription(hour.weatherCode)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
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
            <div>
              <div className="text-sm text-gray-600">풍속</div>
              <div className="text-2xl font-bold text-gray-900">
                {weather.current.windSpeed.toFixed(1)} m/s
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
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
            <div>
              <div className="text-sm text-gray-600">습도</div>
              <div className="text-2xl font-bold text-gray-900">
                {weather.current.humidity}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
