"use client";

import { useQuery } from "@tanstack/react-query";
import { reverseGeocode } from "../api/location.api";

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
