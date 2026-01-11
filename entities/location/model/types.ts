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

/**
 * VWorld Reverse Geocoder API 응답 타입
 * @see https://www.vworld.kr/dev/v4dv_geocoderguide2_s002.do
 */
export interface VWorldReverseResponse {
  response: {
    service: {
      name: string;
      version: string;
      operation: string;
      time: string;
    };
    status: string;
    result?: Array<{
      type: string; // "parcel" | "road"
      text: string; // 전체 주소
      structure: {
        level0: string; // 대한민국
        level1: string; // 시도
        level2: string; // 시군구
        level3: string; // 읍면동
        level4L: string; // 리
        level4LC: string; // 리 코드
        level4A: string; // 도로명
        level4AC: string; // 도로명 코드
        level5: string; // 건물번호
        detail: string; // 상세 주소
      };
    }>;
    error?: {
      level: string;
      text: string;
    };
  };
}
