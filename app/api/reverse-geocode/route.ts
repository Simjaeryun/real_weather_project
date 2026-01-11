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
 * VWorld Reverse Geocoder API 프록시
 * 좌표를 주소로 변환
 * @see https://www.vworld.kr/dev/v4dv_geocoderguide2_s002.do
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
  if (!ENV.VWORLD_API_URL || !ENV.VWORLD_API_KEY) {
    console.error("환경변수 누락:", {
      hasUrl: !!ENV.VWORLD_API_URL,
      hasKey: !!ENV.VWORLD_API_KEY,
    });
    return NextResponse.json(
      { error: "서버 설정 오류: API 설정이 누락되었습니다" },
      { status: 500 },
    );
  }

  try {
    const params = new URLSearchParams({
      service: "address",
      request: "getAddress",
      version: "2.0",
      crs: "epsg:4326",
      point: `${lon},${lat}`, // x,y 순서 (경도,위도)
      format: "json",
      type: "both", // parcel(지번), road(도로명) 모두
      zipcode: "false",
      simple: "false",
      key: ENV.VWORLD_API_KEY,
    });

    const url = `${ENV.VWORLD_API_URL}?${params}`;
    console.log("VWorld Reverse Geocode 요청:", { lat, lon, url });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetchWithRetry(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Vercel/1.0)",
          Accept: "application/json",
        },
        cache: "force-cache",
        signal: controller.signal,
      },
      3,
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("VWorld API 오류:", errorText);
      return NextResponse.json(
        {
          error: "VWorld API 호출 실패",
          status: response.status,
          message: errorText,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("VWorld Reverse Geocode 응답:", JSON.stringify(data, null, 2));
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
