/**
 * 위치 정보 (앱 도메인 타입)
 */
export interface Location {
  id: string; // fullAddress와 동일
  fullAddress: string; // "서울특별시-종로구-청운동"
  city: string; // "서울특별시"
  district?: string; // "종로구"
  neighborhood?: string; // "청운동"
  displayName: string; // "청운동, 종로구, 서울특별시"
  lat?: number; // 위도 (geocoding 후)
  lon?: number; // 경도 (geocoding 후)
}

/**
 * 검색 결과 (매칭 점수 포함)
 */
export interface LocationSearchResult {
  location: Location;
  matchScore: number;
}

/**
 * Nominatim API 응답 타입
 * @see https://nominatim.org/release-docs/latest/api/Output/
 */
export interface NominatimResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: [string, string, string, string]; // [min_lat, max_lat, min_lon, max_lon]
}
