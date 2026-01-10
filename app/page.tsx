import { getLocations } from "@/entities/location";
import { WeatherDashboard } from "@/widgets/weather-dashboard";

export default function Home() {
  // 서버에서 주소 목록만 로드 (좌표 없음)
  // 좌표는 사용자가 선택할 때 필요시에만 클라이언트에서 geocoding
  const locations = getLocations();

  return <WeatherDashboard locations={locations} />;
}
