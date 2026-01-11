import type {
  Location,
  KakaoAddressResponse,
  KakaoCoord2AddressResponse,
} from "../model/types";
import { parseAddress, calculateMatchScore } from "../lib/parser";
import koreaDistricts from "@/public/korea_districts.json";

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
 * 주소를 Kakao API 형식으로 변환
 */
function formatAddress(fullAddress: string): string {
  // "시도-시군구-읍면동" 형식을 "시도 시군구 읍면동"으로 변환
  return fullAddress.replace(/-/g, " ");
}

/**
 * Kakao Local API - 주소 검색 (Next.js API Route를 통해)
 * @see https://developers.kakao.com/docs/latest/ko/local/dev-guide#address-coord
 *
 * @param address - 주소 문자열 (예: "서울특별시 종로구 청운동")
 * @returns Kakao API 응답
 */
export async function fetchGeocode(
  address: string,
): Promise<KakaoAddressResponse> {
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

    // 결과 확인
    if (!data.documents || data.documents.length === 0) {
      console.warn(`좌표 없음: ${location.fullAddress}`);
      return null;
    }

    const firstResult = data.documents[0];
    const { x, y } = firstResult;

    // 응답 검증
    if (!x || !y) {
      console.error(`잘못된 응답 (${location.fullAddress}):`, data);
      return null;
    }

    return {
      ...location,
      lon: parseFloat(x), // 경도
      lat: parseFloat(y), // 위도
    };
  } catch (error) {
    console.error("Geocoding 오류:", error);
    return null;
  }
}

// ----------------------------------------------------------------------
// Reverse Geocoding API (Kakao)
// ----------------------------------------------------------------------

/**
 * Kakao Local API - 좌표로 주소 변환 (Next.js API Route를 통해)
 * @see https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address
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
    const response = await fetch(
      `/api/reverse-geocode?${new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
      })}`,
    );

    if (!response.ok) {
      console.warn(`Reverse Geocoding HTTP 오류: ${response.status}`);
      return null;
    }

    const data: KakaoCoord2AddressResponse = await response.json();

    // 결과 확인
    if (!data.documents || data.documents.length === 0) {
      console.warn("주소 없음:", lat, lon);
      return null;
    }

    const firstResult = data.documents[0];

    // 도로명 주소 우선, 없으면 지번 주소
    const roadAddress = firstResult.road_address;
    const address = firstResult.address;

    if (roadAddress) {
      // 간결한 주소: "시도 시군구 읍면동"
      const parts = [
        roadAddress.region_1depth_name,
        roadAddress.region_2depth_name,
        roadAddress.region_3depth_name,
      ].filter(Boolean);
      return parts.join(" ");
    }

    if (address) {
      const parts = [
        address.region_1depth_name,
        address.region_2depth_name,
        address.region_3depth_name,
      ].filter(Boolean);
      return parts.join(" ");
    }

    return null;
  } catch (error) {
    console.error("Reverse Geocoding 오류:", error);
    return null;
  }
}
