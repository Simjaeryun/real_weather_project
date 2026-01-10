"use client";

import { useState } from "react";
import { type Location, getLocationByIdClient } from "@/entities/location";
import { LocationSearch } from "@/features/weather-search";
import { FavoriteList } from "@/features/favorite-list";
import { WeatherDetail } from "@/features/weather-detail";
import { Spinner, Button } from "@/shared/ui";
import { logger } from "@/shared/api/logger";

type ViewMode = "main" | "detail";

interface WeatherDashboardProps {
  locations: Location[]; // 서버에서 전달받은 주소 데이터
}

export function WeatherDashboard({ locations }: WeatherDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("main");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // 현재 위치 감지
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("위치 서비스를 지원하지 않는 브라우저입니다.");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // 좌표를 기반으로 가장 가까운 지역 찾기
        const location: Location = {
          id: `current-${latitude}-${longitude}`,
          fullAddress: "현재 위치",
          city: "현재 위치",
          displayName: "현재 위치",
          lat: latitude,
          lon: longitude,
        };

        setSelectedLocation(location);
        setViewMode("detail");
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
    // 좌표가 없으면 geocoding
    if (!location.lat || !location.lon) {
      setIsLoadingLocation(true);

      const { geocodeLocation } = await import("@/entities/location");
      const locationWithCoords = await geocodeLocation(location);

      logger({
        eventType: "user_action",
        message: JSON.stringify(locationWithCoords),
      });

      setIsLoadingLocation(false);

      if (
        !locationWithCoords ||
        !locationWithCoords.lat ||
        !locationWithCoords.lon
      ) {
        alert("해당 장소의 좌표를 찾을 수 없습니다.");
        return;
      }

      setSelectedLocation(locationWithCoords);
    } else {
      setSelectedLocation(location);
    }

    setViewMode("detail");
  };

  const handleFavoriteCardClick = (favoriteId: string) => {
    const location = getLocationByIdClient(locations, favoriteId);
    if (location) {
      // 즐겨찾기에는 이미 좌표가 저장되어 있음
      if (!location.lat || !location.lon) {
        alert("해당 장소의 좌표 정보가 없습니다.");
        return;
      }
      setSelectedLocation(location);
      setViewMode("detail");
    }
  };

  const handleBackToMain = () => {
    setViewMode("main");
    setSelectedLocation(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === "main" ? (
          <>
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
              <LocationSearch
                locations={locations}
                onSelect={handleSelectLocation}
              />
            </div>

            {/* 즐겨찾기 목록 */}
            <FavoriteList onCardClick={handleFavoriteCardClick} />
          </>
        ) : (
          selectedLocation && (
            <WeatherDetail
              location={selectedLocation}
              onBack={handleBackToMain}
            />
          )
        )}
      </div>
    </div>
  );
}
