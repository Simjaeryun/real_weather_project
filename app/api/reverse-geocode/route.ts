import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/shared/constants/env";

// Vercel edge runtime에서는 Node.js runtime 사용
export const runtime = "nodejs";

/**
 * Retry 로직이 있는 fetch
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      console.warn(`Fetch 시도 ${i + 1}/${retries} 실패:`, error);

      if (i === retries - 1) {
        throw error;
      }

      // 재시도 전 대기 (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error("Fetch 재시도 실패");
}

/**
 * Kakao Local API 프록시 - 좌표로 주소 변환
 * @see https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat, lon 파라미터가 필요합니다" },
      { status: 400 },
    );
  }

  // 환경변수 검증
  if (!ENV.KAKAO_REST_API_KEY) {
    console.error("Kakao API 키 누락");
    return NextResponse.json(
      { error: "서버 설정 오류: Kakao API 키가 누락되었습니다" },
      { status: 500 },
    );
  }

  try {
    const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?${new URLSearchParams(
      {
        x: lon,
        y: lat,
      },
    )}`;
    console.log("Kakao Reverse Geocode 요청:", { lat, lon });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetchWithRetry(
      url,
      {
        headers: {
          Authorization: `KakaoAK ${ENV.KAKAO_REST_API_KEY}`,
        },
        cache: "force-cache",
        signal: controller.signal,
      },
      3,
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Kakao API 오류:", errorText);
      return NextResponse.json(
        {
          error: "Kakao API 호출 실패",
          status: response.status,
          message: errorText,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("Kakao Reverse Geocode 응답:", JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Reverse Geocoding API 오류:", error);

    // 타임아웃 에러
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "API 요청 시간 초과" },
        { status: 504 },
      );
    }

    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
