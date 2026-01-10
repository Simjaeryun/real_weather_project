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

/**
 * 검색어와 주소 매칭 점수 계산
 */
export function calculateMatchScore(
  address: string,
  searchTerm: string,
): number {
  const normalizedAddress = address.toLowerCase();
  const normalizedSearch = searchTerm.toLowerCase().trim();

  if (!normalizedSearch) return 0;

  // 정확히 일치
  if (normalizedAddress === normalizedSearch) return 100;

  // 시작 부분 일치 (높은 점수)
  if (normalizedAddress.startsWith(normalizedSearch)) return 90;

  // 포함 여부
  if (normalizedAddress.includes(normalizedSearch)) return 70;

  // 부분 일치 (각 단어가 포함되는지)
  const addressParts = address.split("-");
  const matchingParts = addressParts.filter((part) =>
    part.toLowerCase().includes(normalizedSearch),
  );

  if (matchingParts.length > 0) {
    return 50 + matchingParts.length * 10;
  }

  return 0;
}
