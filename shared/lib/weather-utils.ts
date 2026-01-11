/**
 * 날씨 관련 공통 유틸 함수들
 */

/**
 * 날씨 코드에 따른 배경 그라디언트 클래스 반환
 */
export function getWeatherGradient(weatherCode: number): string {
  if (weatherCode === 0) return "from-amber-400 via-orange-400 to-yellow-500"; // 맑음
  if (weatherCode <= 3) return "from-blue-400 via-sky-400 to-cyan-500"; // 구름
  if (weatherCode <= 48) return "from-gray-400 via-slate-400 to-gray-500"; // 안개
  if (weatherCode <= 65) return "from-indigo-500 via-blue-500 to-blue-600"; // 비
  if (weatherCode <= 77) return "from-cyan-400 via-blue-400 to-indigo-400"; // 눈
  if (weatherCode <= 86) return "from-slate-400 via-blue-500 to-indigo-500"; // 눈/비
  return "from-purple-600 via-indigo-600 to-blue-700"; // 뇌우
}

/**
 * 날씨 코드에 따른 카드 배경 그라디언트 클래스 반환 (밝은 버전)
 */
export function getWeatherCardGradient(weatherCode: number): string {
  if (weatherCode === 0) return "from-amber-100 to-orange-100"; // 맑음
  if (weatherCode <= 3) return "from-blue-100 to-cyan-100"; // 구름
  if (weatherCode <= 48) return "from-gray-100 to-slate-100"; // 안개
  if (weatherCode <= 65) return "from-indigo-100 to-blue-100"; // 비
  if (weatherCode <= 77) return "from-blue-50 to-cyan-100"; // 눈
  if (weatherCode <= 86) return "from-slate-100 to-blue-100"; // 눈/비
  return "from-purple-100 to-indigo-100"; // 뇌우
}

/**
 * ISO 시간 문자열을 "00시" 형식으로 포맷
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.getHours().toString().padStart(2, "0") + "시";
}
