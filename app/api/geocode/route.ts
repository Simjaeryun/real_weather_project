import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/shared/api/env";

/**
 * VWorld Geocoder API 프록시
 * 좌표값은 변하지 않기 때문에  force-cache 설정.
 */

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "주소 파라미터가 필요합니다" },
      { status: 400 },
    );
  }

  try {
    const params = new URLSearchParams({
      service: "address",
      request: "getcoord",
      version: "2.0",
      crs: "epsg:4326",
      address: address,
      refine: "true",
      simple: "false",
      format: "json",
      type: "parcel", // parcel(지번) 대신 road(도로명) 시도
      key: ENV.VWORLD,
    });

    const url = `${ENV.VWORLD_API_URL}?${params}`;
    console.log("VWorld API 요청 URL:", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });

    console.log("VWorld API 응답 상태:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("VWorld API 오류 응답:", errorText);
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
    console.log("VWorld API 응답 데이터:", JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Geocoding API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
