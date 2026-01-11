export const ENV = {
  // Kakao Maps API (서버 사이드 전용 - API Routes에서만 사용)
  KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY || "",

  // 앱 URL
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "",

  // 날씨 API
  WEATHER_API_URL: process.env.NEXT_PUBLIC_WEATHER_API_URL || "",
} as const;
