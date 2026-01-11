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
 * 검색어와 주소의 매칭 점수 계산
 * 점수가 높을수록 더 관련성이 높음
 */
export function calculateMatchScore(address: string, query: string): number {
  const normalizedAddress = address.toLowerCase().replace(/-/g, " ");
  const normalizedQuery = query.toLowerCase().trim();

  // 정확히 일치
  if (normalizedAddress === normalizedQuery) return 1000;

  // 시작 부분 일치
  if (normalizedAddress.startsWith(normalizedQuery)) return 500;

  // 포함 여부
  if (normalizedAddress.includes(normalizedQuery)) return 100;

  // 부분 일치 (각 단어별)
  const queryParts = normalizedQuery.split(/\s+/);
  const addressParts = normalizedAddress.split(/[\s-]+/);

  let score = 0;
  for (const queryPart of queryParts) {
    for (const addressPart of addressParts) {
      if (addressPart.includes(queryPart)) {
        score += 10;
      }
      if (addressPart.startsWith(queryPart)) {
        score += 20;
      }
    }
  }

  return score;
}
