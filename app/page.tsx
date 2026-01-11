import { WeatherDashboard } from "@/widgets/weather-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "홈",
  description:
    "현재 위치의 실시간 날씨 정보와 즐겨찾기한 지역의 날씨를 한눈에 확인하세요.",
  openGraph: {
    title: "Real Weather - 실시간 날씨 정보",
    description: "현재 위치의 날씨와 즐겨찾기 지역을 확인하세요.",
  },
};

export default function Home() {
  return <WeatherDashboard />;
}
