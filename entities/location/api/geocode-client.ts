"use client";

import type { Location } from "../model/types";

/**
 * Nominatim API 응답 타입
 * @see https://nominatim.org/release-docs/latest/api/Output/
 */
export interface NominatimResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: [string, string, string, string]; // [min_lat, max_lat, min_lon, max_lon]
}

/**
 * 주소를 쉼표로 구분된 형식으로 변환
 */
function formatAddress(fullAddress: string): string {
  const parts = fullAddress.split("-").reverse();
  return [...parts, "대한민국"].join(", ");
}

/**
 * 클라이언트에서 Nominatim API로 geocoding
 * 사용자가 주소 선택할 때만 호출
 */
export async function geocodeLocation(
  location: Location,
): Promise<Location | null> {
  try {
    const query = formatAddress(location.fullAddress);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: query,
          format: "json",
          limit: "1",
          countrycodes: "kr",
        }),
      {
        headers: {
          "User-Agent": "WeatherApp/1.0",
        },
      },
    );

    if (!response.ok) {
      console.error(
        `Geocoding 실패 (${location.fullAddress}): ${response.status}`,
      );
      return null;
    }

    const data: NominatimResponse[] = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`좌표 없음: ${location.fullAddress}`);
      return null;
    }

    const result = data[0];

    // 응답 검증
    if (!result.lat || !result.lon) {
      console.error(`잘못된 응답 (${location.fullAddress}):`, result);
      return null;
    }

    return {
      ...location,
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
    };
  } catch (error) {
    console.error("Geocoding 오류:", error);
    return null;
  }
}
