"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWeatherData } from "../api/weather-api";
import type { WeatherData } from "./types";

/**
 * 위치 좌표로 날씨 데이터 가져오기
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
    staleTime: 1000 * 60 * 10, // 10분간 fresh
    gcTime: 1000 * 60 * 30, // 30분간 캐시 유지
  });
}
