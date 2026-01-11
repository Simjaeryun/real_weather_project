export const ENV = {
  // 서버 사이드 전용 (API Routes에서만 사용)
  VWORLD_API_KEY: process.env.VWORLD_API_KEY || "",
  VWORLD_API_URL: process.env.VWORLD_API_URL || "",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "",

  // 클라이언트 사이드에서도 사용
  WEATHER_API_URL: process.env.NEXT_PUBLIC_WEATHER_API_URL || "",
} as const;
