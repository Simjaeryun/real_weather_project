import { useState } from "react";

/**
 * 브라우저의 Geolocation API를 사용하는 Hook
 */
export function useCurrentLocation() {
  const [isLoading, setIsLoading] = useState(false);

  const detectCurrentLocation = (
    onSuccess: (lat: number, lon: number) => void,
  ) => {
    if (!navigator.geolocation) {
      alert("위치 서비스를 지원하지 않는 브라우저입니다.");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSuccess(latitude, longitude);
        setIsLoading(false);
      },
      (error) => {
        console.error("위치 감지 실패:", error);
        alert("위치 정보를 가져올 수 없습니다. 위치 권한을 허용해주세요.");
        setIsLoading(false);
      },
    );
  };

  return { detectCurrentLocation, isLoading };
}
