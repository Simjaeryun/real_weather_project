import type { Location } from "../model/types";

/**
 * "서울특별시-종로구-청운동" 형식의 주소 문자열을 파싱
 */
export function parseAddress(fullAddress: string): Location {
  const parts = fullAddress.split("-");
  const city = parts[0];
  const district = parts[1];
  const neighborhood = parts[2];

  // 표시용 이름 생성 (역순으로)
  const displayParts = [neighborhood, district, city].filter(Boolean);
  const displayName = displayParts.join(", ");

  return {
    id: fullAddress,
    fullAddress,
    city,
    district,
    neighborhood,
    displayName,
  };
}
