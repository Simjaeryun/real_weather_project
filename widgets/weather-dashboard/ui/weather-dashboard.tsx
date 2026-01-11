"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Location, geocodeLocation } from "@/entities/location";
import { getFavorites } from "@/entities/favorite";
import { LocationSearch } from "@/features/weather-search";
import { FavoriteList } from "@/features/favorite-list";
import { Spinner, Button } from "@/shared/ui";

export function WeatherDashboard() {
  const router = useRouter();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  // 현재 위치 감지
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("위치 서비스를 지원하지 않는 브라우저입니다.");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // 현재 위치 페이지로 이동 (searchParams로 좌표 전달)
        router.push(
          `/weather?lat=${latitude}&lon=${longitude}&name=${encodeURIComponent("현재 위치")}`,
        );
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("위치 감지 실패:", error);
        alert("위치 정보를 가져올 수 없습니다. 위치 권한을 허용해주세요.");
        setIsLoadingLocation(false);
      },
    );
  };

  const handleSelectLocation = async (location: Location) => {
    // 클라이언트에서 좌표 가져오기
    setIsLoadingSearch(true);
    try {
      const locationWithCoords = await geocodeLocation(location);

      if (
        !locationWithCoords ||
        !locationWithCoords.lat ||
        !locationWithCoords.lon
      ) {
        alert("좌표를 가져올 수 없습니다.");
        return;
      }

      // 좌표를 searchParams로 전달
      const { lat, lon, fullAddress } = locationWithCoords;
      router.push(
        `/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(fullAddress)}`,
      );
    } catch (error) {
      console.error("좌표 조회 실패:", error);
      alert("좌표 조회에 실패했습니다.");
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleFavoriteCardClick = async (favoriteId: string) => {
    // 즐겨찾기에서 location 찾기
    const favorites = getFavorites();
    const favorite = favorites.find((f) => f.id === favoriteId);

    if (!favorite) return;

    const { location } = favorite;

    // 좌표가 이미 있는 경우
    if (location.lat && location.lon) {
      router.push(
        `/weather?lat=${location.lat}&lon=${location.lon}&name=${encodeURIComponent(location.fullAddress)}`,
      );
      return;
    }

    // 좌표가 없는 경우 (이전 데이터) - geocoding 필요
    setIsLoadingSearch(true);
    try {
      const locationWithCoords = await geocodeLocation(location);

      if (
        !locationWithCoords ||
        !locationWithCoords.lat ||
        !locationWithCoords.lon
      ) {
        alert("좌표를 가져올 수 없습니다.");
        return;
      }

      const { lat, lon, fullAddress } = locationWithCoords;
      router.push(
        `/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(fullAddress)}`,
      );
    } catch (error) {
      console.error("좌표 조회 실패:", error);
      alert("좌표 조회에 실패했습니다.");
    } finally {
      setIsLoadingSearch(false);
    }
  };

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
            onClick={detectCurrentLocation}
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
          {isLoadingSearch && (
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
