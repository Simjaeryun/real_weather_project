"use client";

import { externalApi } from "@/shared/api/instance";
import type { OpenMeteoResponse, WeatherData } from "../model/types";
import { ENV } from "@/shared/constants/env";

/**
 * Open-Meteo API로 날씨 데이터 가져오기
 * API 키 불필요, 무료
 */
export async function fetchWeatherData(
  lat: number,
  lon: number,
  locationName: string,
): Promise<WeatherData> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current:
        "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
      hourly: "temperature_2m,weather_code",
      daily: "temperature_2m_max,temperature_2m_min,weather_code",
      timezone: "Asia/Seoul",
    });

    const response = await externalApi.get(`${ENV.WEATHER_API_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    const data: OpenMeteoResponse = await response.json();

    return transformWeatherData(data, locationName);
  } catch (error) {
    console.error("날씨 데이터 가져오기 실패:", error);
    throw new Error("날씨 정보를 가져올 수 없습니다.");
  }
}

/**
 * API 응답을 내부 데이터 구조로 변환
 */
function transformWeatherData(
  data: OpenMeteoResponse,
  locationName: string,
): WeatherData {
  // 현재 날씨
  const current = {
    temp: Math.round(data.current.temperature_2m),
    humidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
    windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
  };

  // 오늘 날씨
  const daily = {
    date: data.daily.time[0],
    tempMin: Math.round(data.daily.temperature_2m_min[0]),
    tempMax: Math.round(data.daily.temperature_2m_max[0]),
    weatherCode: data.daily.weather_code[0],
  };

  // 시간별 예보 (24시간)
  const hourly = data.hourly.time.slice(0, 24).map((time, index) => ({
    time,
    temp: Math.round(data.hourly.temperature_2m[index]),
    weatherCode: data.hourly.weather_code[index],
  }));

  return {
    locationName,
    current,
    daily,
    hourly,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * WMO Weather Code를 설명으로 변환
 * @see https://open-meteo.com/en/docs
 */
export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: "맑음",
    1: "대체로 맑음",
    2: "부분적으로 흐림",
    3: "흐림",
    45: "안개",
    48: "어는 안개",
    51: "가벼운 이슬비",
    53: "이슬비",
    55: "강한 이슬비",
    61: "약한 비",
    63: "비",
    65: "강한 비",
    71: "약한 눈",
    73: "눈",
    75: "강한 눈",
    77: "진눈깨비",
    80: "약한 소나기",
    81: "소나기",
    82: "강한 소나기",
    85: "약한 눈",
    86: "강한 눈",
    95: "뇌우",
    96: "약한 우박을 동반한 뇌우",
    99: "강한 우박을 동반한 뇌우",
  };

  return descriptions[code] || "알 수 없음";
}

/**
 * 날씨 코드를 이모지로 변환
 */
export function getWeatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "🌤️";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌧️";
  if (code <= 65) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  if (code <= 86) return "🌨️";
  return "⛈️";
}
