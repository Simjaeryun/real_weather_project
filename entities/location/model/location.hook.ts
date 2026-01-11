"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useGeocodeQuery } from "../api/location.query";
import type { Location } from "./types";
import { reverseGeocode } from "../api/location.api";

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

/**
 * 좌표를 주소로 변환하는 Hook (캐싱 적용)
 * 같은 좌표에 대한 반복 요청을 방지
 */
export function useReverseGeocode(lat?: number, lon?: number) {
  return useQuery({
    queryKey: ["reverseGeocode", lat, lon],
    queryFn: () => {
      if (!lat || !lon) {
        throw new Error("좌표 정보가 없습니다.");
      }
      return reverseGeocode(lat, lon);
    },
    enabled: !!lat && !!lon,
    staleTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지 (주소는 잘 안 바뀜)
    gcTime: 1000 * 60 * 60 * 24, // 24시간 후 가비지 컬렉션
  });
}
