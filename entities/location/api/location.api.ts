import type {
  Location,
  VWorldResponse,
  VWorldReverseResponse,
} from "../model/types";
import { parseAddress, calculateMatchScore } from "../lib/parser";
import koreaDistricts from "@/public/korea_districts.json";
import { ENV } from "@/shared/constants/env";

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
export function searchLocations(query: string, limit: number = 20): Location[] {
  if (!query.trim()) return [];

  // 매칭 점수 계산 및 정렬
  const results = locations
    .map((location) => ({
      location,
      score: calculateMatchScore(location.fullAddress, query),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((result) => result.location);

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
  return fullAddress.replace(/-/g, " ");
}

/**
 * VWorld Geocoder API 호출
 * Next.js API Route를 통해 프록시 호출 (CORS 해결)
 *
 * @param address - 주소 문자열 (예: "서울특별시 종로구 청운동")
 * @returns VWorld API 응답
 */
export async function fetchGeocode(address: string): Promise<VWorldResponse> {
  // 상대 경로로 Next.js API Route 호출
  const response = await fetch(
    `/api/geocode?${new URLSearchParams({ address })}`,
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

// ----------------------------------------------------------------------
// Reverse Geocoding API (VWorld)
// ----------------------------------------------------------------------

/**
 * VWorld Reverse Geocoder API 호출
 * 좌표를 주소로 변환
 * @see https://www.vworld.kr/dev/v4dv_geocoderguide2_s002.do
 *
 * @param lat - 위도
 * @param lon - 경도
 * @returns 주소 문자열 또는 null
 */
export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<string | null> {
  try {
    // 상대 경로로 Next.js API Route 호출
    const response = await fetch(
      `/api/reverse-geocode?${new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
      })}`,
    );

    if (!response.ok) {
      throw new Error(`Reverse Geocoding 실패: ${response.status}`);
    }

    const data: VWorldReverseResponse = await response.json();

    // 응답 상태 확인
    if (data.response.status !== "OK") {
      console.warn("VWorld Reverse Geocode 오류:", data.response.error);
      return null;
    }

    // 결과 확인
    if (!data.response.result || data.response.result.length === 0) {
      console.warn("주소 없음:", lat, lon);
      return null;
    }

    // 도로명 주소 우선, 없으면 지번 주소
    const roadAddress = data.response.result.find(
      (r: { type: string }) => r.type === "road",
    );
    const parcelAddress = data.response.result.find(
      (r: { type: string }) => r.type === "parcel",
    );
    const address = roadAddress || parcelAddress;

    if (!address) {
      return null;
    }

    // 간결한 주소 생성: "시도 시군구 읍면동"
    const { level1, level2, level3 } = address.structure;
    const parts = [level1, level2, level3].filter(Boolean);
    return parts.join(" ");
  } catch (error) {
    console.error("Reverse Geocoding 오류:", error);
    return null;
  }
}
