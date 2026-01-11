import { z } from "zod";

const envSchema = z.object({
  KAKAO_REST_API_KEY: z.string().min(1, "Kakao API 키가 필요합니다"),
  WEATHER_API_URL: z.string().url("올바른 URL 형식이 아닙니다"),
  APP_URL: z.string().url("올바른 URL 형식이 아닙니다").optional(),
});

export type ValidatedEnv = z.infer<typeof envSchema>;

/**
 * 환경변수를 런타임에 검증합니다.
 * 서버 시작 시 한 번만 호출하여 잘못된 설정을 조기에 발견합니다.
 */
export function validateEnv(): ValidatedEnv {
  const result = envSchema.safeParse({
    KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY,
    WEATHER_API_URL: process.env.NEXT_PUBLIC_WEATHER_API_URL,
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!result.success) {
    console.error("❌ 환경변수 검증 실패:");
    console.error(result.error.format());
    throw new Error(
      "환경변수 설정을 확인해주세요. .env.local 파일을 확인하세요.",
    );
  }

  console.log("✅ 환경변수 검증 성공");
  return result.data;
}

/**
 * 클라이언트 사이드 환경변수 검증
 */
export function validateClientEnv() {
  const clientSchema = z.object({
    WEATHER_API_URL: z.string().url("올바른 URL 형식이 아닙니다"),
    APP_URL: z.string().url("올바른 URL 형식이 아닙니다").optional(),
  });

  const result = clientSchema.safeParse({
    WEATHER_API_URL: process.env.NEXT_PUBLIC_WEATHER_API_URL,
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!result.success) {
    console.error("❌ 클라이언트 환경변수 검증 실패:", result.error.format());
    return null;
  }

  return result.data;
}
