"use client";

import { useState } from "react";
import { useGeocodeQuery } from "../api/location.query";
import type { Location } from "./types";

interface UseLocationCoordsResult {
  getCoords: (location: Location) => Promise<Location | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Location 객체의 좌표를 가져오는 Hook
 * 이미 좌표가 있으면 그대로 반환, 없으면 geocoding API 호출
 */
export function useLocationCoords(): UseLocationCoordsResult {
  const { fetchCoords } = useGeocodeQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCoords = async (location: Location): Promise<Location | null> => {
    // 이미 좌표가 있으면 그대로 반환
    if (location.lat && location.lon) {
      return location;
    }

    // 좌표가 없으면 geocoding (캐시 활용)
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchCoords(location);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "좌표 조회 실패";
      console.error("좌표 조회 실패:", err);
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getCoords,
    isLoading,
    error,
  };
}
