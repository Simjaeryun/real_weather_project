import { parseAddress } from "@/entities/location";
import { WeatherDetail } from "@/features/weather-detail";
import type { Metadata } from "next";

interface WeatherPageProps {
  searchParams: Promise<{ lat?: string; lon?: string; name?: string }>;
}

export async function generateMetadata({
  searchParams,
}: WeatherPageProps): Promise<Metadata> {
  const { lat, lon, name } = await searchParams;
  const locationName = name ? decodeURIComponent(name) : "현재 위치";

  return {
    title: `${locationName} 날씨`,
    description: `${locationName}의 실시간 날씨 정보를 확인하세요. 기온, 습도, 강수량, 풍속 등 상세한 날씨 데이터를 제공합니다.`,
    openGraph: {
      title: `${locationName} 날씨 | Real Weather`,
      description: `${locationName}의 실시간 날씨 정보`,
      url: `/weather?lat=${lat}&lon=${lon}&name=${name || ""}`,
    },
  };
}

export default async function WeatherPage({ searchParams }: WeatherPageProps) {
  const { lat: latStr, lon: lonStr, name } = await searchParams;

  // 좌표 파라미터 체크
  if (!latStr || !lonStr) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-2">좌표 정보가 필요합니다.</p>
          <p className="text-gray-500 text-sm">
            lat와 lon 파라미터를 제공해주세요.
          </p>
        </div>
      </div>
    );
  }

  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  // 좌표 유효성 검사
  if (isNaN(lat) || isNaN(lon)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-2">잘못된 좌표 형식입니다.</p>
          <p className="text-gray-500 text-sm">
            lat: {latStr}, lon: {lonStr}
          </p>
        </div>
      </div>
    );
  }

  // Location 객체 생성
  const displayName = name ? decodeURIComponent(name) : `${lat}, ${lon}`;
  const location = name
    ? { ...parseAddress(decodeURIComponent(name)), lat, lon }
    : {
        id: `${lat},${lon}`,
        displayName,
        fullAddress: displayName,
        city: "현재 위치",
        lat,
        lon,
      };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WeatherDetail location={location} />
      </div>
    </div>
  );
}
