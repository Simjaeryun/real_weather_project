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
 * Kakao Local API - 주소 검색 응답 타입
 * @see https://developers.kakao.com/docs/latest/ko/local/dev-guide#address-coord
 */
export interface KakaoAddressResponse {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: Array<{
    address_name: string; // 전체 지번 주소
    address_type: "REGION" | "ROAD" | "REGION_ADDR" | "ROAD_ADDR";
    x: string; // 경도
    y: string; // 위도
    address?: {
      address_name: string;
      region_1depth_name: string; // 시도
      region_2depth_name: string; // 시군구
      region_3depth_name: string; // 읍면동
      mountain_yn: "Y" | "N";
      main_address_no: string;
      sub_address_no: string;
      zip_code: string;
    };
    road_address?: {
      address_name: string;
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_name: string;
      road_name: string;
      underground_yn: "Y" | "N";
      main_building_no: string;
      sub_building_no: string;
      building_name: string;
      zone_no: string;
    };
  }>;
}

/**
 * Kakao Local API - 좌표로 주소 변환 응답 타입
 * @see https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address
 */
export interface KakaoCoord2AddressResponse {
  meta: {
    total_count: number;
  };
  documents: Array<{
    address: {
      address_name: string; // 전체 지번 주소
      region_1depth_name: string; // 시도
      region_2depth_name: string; // 시군구
      region_3depth_name: string; // 읍면동
      mountain_yn: "Y" | "N";
      main_address_no: string;
      sub_address_no: string;
      zip_code: string;
    };
    road_address: {
      address_name: string; // 전체 도로명 주소
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_name: string;
      road_name: string;
      underground_yn: "Y" | "N";
      main_building_no: string;
      sub_building_no: string;
      building_name: string;
      zone_no: string;
    } | null;
  }>;
}
