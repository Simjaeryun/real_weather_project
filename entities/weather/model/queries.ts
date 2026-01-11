"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWeatherData } from "../api/weather-api";
import type { WeatherData } from "./types";

/**
 * 위치 좌표로 날씨 데이터 가져오기
 *
 * 날씨는 10분마다 갱신 → staleTime & gcTime 모두 10분
 */
export function useWeather(
  lat: number | undefined,
  lon: number | undefined,
  locationName: string,
) {
  return useQuery<WeatherData>({
    queryKey: ["weather", lat, lon],
    queryFn: () => {
      if (!lat || !lon) {
        throw new Error("위치 정보가 없습니다.");
      }
      return fetchWeatherData(lat, lon, locationName);
    },
    enabled: !!lat && !!lon,
    staleTime: 1000 * 60 * 10, // 10분간 fresh (재요청 안함)
    gcTime: 1000 * 60 * 10, // 10분 후 캐시 제거
  });
}

/**
 * 날씨 데이터를 미리 가져오는 훅 (즐겨찾기 추가 시 사용)
 */
export function usePrefetchWeather() {
  const queryClient = useQueryClient();

  const prefetchWeather = async (
    lat: number,
    lon: number,
    locationName: string,
  ) => {
    await queryClient.prefetchQuery({
      queryKey: ["weather", lat, lon],
      queryFn: () => fetchWeatherData(lat, lon, locationName),
      staleTime: 1000 * 60 * 10,
    });
  };

  return { prefetchWeather };
}

// 날씨가 10분내로 변화가 없다고 가정.
