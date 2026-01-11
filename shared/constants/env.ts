import { validateEnv } from "../lib/env-validator";

// 서버 시작 시 환경변수 검증
let validatedEnv: ReturnType<typeof validateEnv> | null = null;

// 서버 사이드에서만 검증 실행
if (typeof window === "undefined") {
  try {
    validatedEnv = validateEnv();
  } catch (error) {
    console.error("환경변수 검증 실패:", error);
    // 개발 환경에서는 에러를 던지고, 프로덕션에서는 로그만 남김
    if (process.env.NODE_ENV === "development") {
      throw error;
    }
  }
}

export const ENV = {
  // Kakao Maps API (서버 사이드 전용 - API Routes에서만 사용)
  KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY || "",

  // 앱 URL
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "",

  // 날씨 API
  WEATHER_API_URL: process.env.NEXT_PUBLIC_WEATHER_API_URL || "",
} as const;
