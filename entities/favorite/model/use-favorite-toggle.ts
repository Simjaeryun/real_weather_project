import { useFavorites } from "./favorite.hooks";
import { useLocationCoords } from "@/entities/location";
import { usePrefetchWeather } from "@/entities/weather";
import type { Location } from "@/entities/location";

/**
 * 즐겨찾기 토글 로직
 * - 좌표 조회 포함
 * - 날씨 데이터 prefetch
 * - 최대 개수 체크
 */
export function useFavoriteToggle() {
  const { addFavorite, removeFavorite, isFavorite, canAddMore } =
    useFavorites();
  const { getCoords } = useLocationCoords();
  const { prefetchWeather } = usePrefetchWeather();

  const toggleFavorite = async (location: Location, alias?: string) => {
    const isInFavorites = isFavorite(location.id);

    if (isInFavorites) {
      removeFavorite(location.id);
      return;
    }

    // 추가
    if (!canAddMore) {
      alert("최대 6개까지만 추가할 수 있습니다.");
      return;
    }

    // 1. 좌표가 없으면 먼저 조회
    let locationWithCoords = location;
    if (!location.lat || !location.lon) {
      const coordsResult = await getCoords(location);
      if (!coordsResult) {
        alert("좌표 조회에 실패했습니다. 다시 시도해주세요.");
        return;
      }
      locationWithCoords = coordsResult;
    }

    // 2. 좌표가 포함된 location으로 즐겨찾기 추가
    addFavorite({
      id: locationWithCoords.id,
      location: locationWithCoords,
      alias: alias || locationWithCoords.displayName,
      addedAt: new Date().toISOString(),
    });

    // 3. 날씨 데이터 미리 가져오기 (백그라운드에서 실행)
    if (locationWithCoords.lat && locationWithCoords.lon) {
      prefetchWeather(
        locationWithCoords.lat,
        locationWithCoords.lon,
        locationWithCoords.displayName,
      ).catch((error) => {
        console.error("날씨 prefetch 실패:", error);
        // 에러가 나도 즐겨찾기는 추가된 상태 유지
      });
    }
  };

  return {
    toggleFavorite,
    isFavorite,
    canAddMore,
  };
}
