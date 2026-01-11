"use client";

import { useQuery } from "@tanstack/react-query";

interface Coordinates {
  lat: number;
  lon: number;
}

/**
 * 브라우저의 Geolocation API로 현재 위치 가져오기
 */
const getCurrentPosition = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("위치 서비스를 지원하지 않는 브라우저입니다."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ lat: latitude, lon: longitude });
      },
      (error) => {
        console.error("위치 감지 실패:", error);
        reject(
          new Error(
            "위치 정보를 가져올 수 없습니다. 위치 권한을 허용해주세요.",
          ),
        );
      },
    );
  });
};

/**
 * 현재 위치를 Query로 관리하는 Hook
 */
export function useCurrentLocation() {
  return useQuery<Coordinates>({
    queryKey: ["currentLocation"],
    queryFn: getCurrentPosition,
    staleTime: 1000 * 60 * 5, // 5분간 fresh (같은 위치로 간주)
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    retry: false, // 위치 권한 거부 시 재시도 안 함
  });
}
