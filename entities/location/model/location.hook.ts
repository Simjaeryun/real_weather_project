"use client";

import { useMutation } from "@tanstack/react-query";
import { useGeocodeQuery } from "../api/location.query";
import type { Location } from "./types";

/**
 * Location 객체의 좌표를 가져오는 Hook
 * useMutation을 사용하여 명령형 API 제공
 */
export function useLocationCoords() {
  const { fetchCoords } = useGeocodeQuery();

  const mutation = useMutation<Location, Error, Location>({
    mutationFn: async (location: Location) => {
      // 이미 좌표가 있으면 그대로 반환
      if (location.lat && location.lon) {
        return location;
      }

      // 좌표가 없으면 geocoding (캐시 활용)
      return await fetchCoords(location);
    },
  });

  return {
    getCoords: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}
