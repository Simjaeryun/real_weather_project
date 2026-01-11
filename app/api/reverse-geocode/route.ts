import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/shared/constants/env";

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
    console.log("VWorld Reverse Geocode 요청:", { lat, lon });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache", // 좌표는 불변이므로 캐싱
    });

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
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
