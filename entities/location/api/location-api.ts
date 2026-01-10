import type { Location, LocationSearchResult } from "../model/types";
import { calculateMatchScore } from "../lib/parser";

/**
 * 클라이언트용: 주소 검색 (자동완성)
 * 서버에서 전달받은 locations 배열에서 검색
 */
export function searchLocationsClient(
  locations: Location[],
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

/**
 * 클라이언트용: ID로 주소 찾기
 */
export function getLocationByIdClient(
  locations: Location[],
  id: string,
): Location | null {
  return locations.find((loc) => loc.id === id) || null;
}
