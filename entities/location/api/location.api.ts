import type {
  Location,
  LocationSearchResult,
  VWorldResponse,
} from "../model/types";
import { parseAddress, calculateMatchScore } from "../lib/parser";
import koreaDistricts from "@/public/korea_districts.json";
import { ENV } from "@/shared/api/env";
import { apiInstance } from "@/shared/api/instance";
import { logger } from "@/shared/api/logger";

// ----------------------------------------------------------------------
// Location 데이터
// ----------------------------------------------------------------------

/**
 * 주소 목록을 Location 객체로 변환 (좌표 없음)
 * 좌표는 사용자가 선택할 때 필요시에만 geocoding
 */
const locations: Location[] = koreaDistricts.map((address) => {
  return {
    ...parseAddress(address),
  };
});

/**
 * 전체 주소 목록 반환
 */
export function getLocations(): Location[] {
  return locations;
}

/**
 * ID로 주소 찾기
 */
export function getLocationById(id: string): Location | null {
  return locations.find((loc) => loc.id === id) || null;
}

/**
 * 주소 검색 (자동완성)
 */
export function searchLocations(
  query: string,
  limit: number = 20,
): LocationSearchResult[] {
  if (!query.trim()) return [];

  // 매칭 점수 계산
  const results: LocationSearchResult[] = locations
    .map((location) => ({
      location,
      matchScore: calculateMatchScore(location.fullAddress, query),
    }))
    .filter((result) => result.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);

  return results;
}

// ----------------------------------------------------------------------
// Geocoding API
// ----------------------------------------------------------------------

/**
 * 주소를 VWorld API 형식으로 변환
 */
function formatAddress(fullAddress: string): string {
  // "시도-시군구-읍면동" 형식을 "시도 시군구 읍면동"으로 변환
  const formatted = fullAddress.replace(/-/g, " ");
  console.log("주소 변환:", fullAddress, "->", formatted);
  return formatted;
}

/**
 * VWorld Geocoder API 호출
 * Next.js API Route를 통해 프록시 호출 (CORS 해결)
 *
 * @param address - 주소 문자열 (예: "서울특별시 종로구 청운동")
 * @returns VWorld API 응답
 */
export async function fetchGeocode(address: string): Promise<VWorldResponse> {
  // 서버/클라이언트 환경 구분
  const baseUrl = ENV.APP_URL;

  // 네이티브 fetch 사용 (절대 경로 필요)
  const response = await fetch(
    `${baseUrl}/api/geocode?${new URLSearchParams({ address })}`,
  );

  if (!response.ok) {
    throw new Error(`Geocoding 실패: ${response.status}`);
  }

  return response.json();
}

/**
 * Location 객체를 받아서 좌표 정보를 추가
 *
 * @param location - 좌표가 없는 Location 객체
 * @returns 좌표가 추가된 Location 객체 또는 null
 */
export async function geocodeLocation(
  location: Location,
): Promise<Location | null> {
  try {
    const address = formatAddress(location.fullAddress);
    const data = await fetchGeocode(address);

    // 응답 상태 확인
    if (data.response.status !== "OK") {
      console.warn(
        `VWorld API 오류 (${location.fullAddress}):`,
        data.response.error,
      );
      return null;
    }

    // 결과 확인
    if (!data.response.result?.point) {
      console.warn(`좌표 없음: ${location.fullAddress}`);
      return null;
    }

    const { x, y } = data.response.result.point;

    // 응답 검증
    if (!x || !y) {
      console.error(`잘못된 응답 (${location.fullAddress}):`, data);
      return null;
    }

    return {
      ...location,
      lon: parseFloat(x), // VWorld: x = 경도
      lat: parseFloat(y), // VWorld: y = 위도
    };
  } catch (error) {
    console.error("Geocoding 오류:", error);
    return null;
  }
}
