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
 * VWorld Geocoder API 응답 타입
 * @see https://www.vworld.kr/dev/v4dv_geocoderguide2_s001.do
 */
export interface VWorldResponse {
  response: {
    service: {
      name: string;
      version: string;
      operation: string;
      time: string;
    };
    status: string;
    result?: {
      crs: string;
      point: {
        x: string; // 경도 (longitude)
        y: string; // 위도 (latitude)
      };
    };
    error?: {
      level: string;
      text: string;
    };
  };
}
