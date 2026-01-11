import { useRouter } from "next/navigation";
import { type Location, useLocationCoords } from "@/entities/location";
import { getFavorites } from "@/entities/favorite";

/**
 * 날씨 페이지 네비게이션 로직을 관리하는 Hook
 */
export function useWeatherNavigation() {
  const router = useRouter();
  const { getCoords, isLoading: isLoadingCoords } = useLocationCoords();

  /**
   * 좌표를 포함한 날씨 페이지로 이동
   */
  const navigateToWeather = (lat: number, lon: number, name: string) => {
    router.push(
      `/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}`,
    );
  };

  /**
   * 검색된 위치 선택 핸들러
   */
  const handleSelectLocation = async (location: Location) => {
    const locationWithCoords = await getCoords(location);

    if (
      !locationWithCoords ||
      !locationWithCoords.lat ||
      !locationWithCoords.lon
    ) {
      alert("좌표를 가져올 수 없습니다.");
      return;
    }

    const { lat, lon, fullAddress } = locationWithCoords;
    navigateToWeather(lat, lon, fullAddress);
  };

  /**
   * 즐겨찾기 카드 클릭 핸들러
   */
  const handleFavoriteCardClick = async (favoriteId: string) => {
    const favorites = getFavorites();
    const favorite = favorites.find((f) => f.id === favoriteId);

    if (!favorite) return;

    const locationWithCoords = await getCoords(favorite.location);

    if (
      !locationWithCoords ||
      !locationWithCoords.lat ||
      !locationWithCoords.lon
    ) {
      alert("좌표를 가져올 수 없습니다.");
      return;
    }

    const { lat, lon, fullAddress } = locationWithCoords;
    navigateToWeather(lat, lon, fullAddress);
  };

  /**
   * 현재 위치로 이동
   */
  const navigateToCurrentLocation = (lat: number, lon: number) => {
    navigateToWeather(lat, lon, "현재 위치");
  };

  return {
    handleSelectLocation,
    handleFavoriteCardClick,
    navigateToCurrentLocation,
    isLoadingCoords,
  };
}
