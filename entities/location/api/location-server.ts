import type { Location } from "../model/types";
import { parseAddress } from "../lib/parser";
import koreaDistricts from "@/public/korea_districts.json";

/**
 * 주소 목록을 Location 객체로 변환 (좌표 없음)
 * 좌표는 사용자가 선택할 때 필요시에만 geocoding
 */
const locations: Location[] = koreaDistricts.map((address) => {
  return {
    ...parseAddress(address),
    lat: undefined, // 나중에 필요할 때 geocoding
    lon: undefined,
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
