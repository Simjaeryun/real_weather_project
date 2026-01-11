import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { geocodeLocation } from "./location.api";
import type { Location } from "../model/types";

/**
 * Geocoding Query Options
 * 같은 주소는 항상 같은 좌표를 반환하므로 캐싱 최적화
 */
export const geocodeQueryOptions = (location: Location) =>
  queryOptions({
    queryKey: ["geocode", location.fullAddress],
    queryFn: async () => {
      const result = await geocodeLocation(location);

      if (!result || !result.lat || !result.lon) {
        throw new Error("좌표를 가져올 수 없습니다.");
      }

      return result;
    },
    staleTime: Infinity, // 좌표는 절대 바뀌지 않음
    gcTime: 1000 * 60 * 60 * 24, // 24시간 캐시 유지
  });

/**
 * Geocoding을 수행하는 함수
 * QueryClient를 사용해서 캐시를 활용
 */
export function useGeocodeQuery() {
  const queryClient = useQueryClient();

  const fetchCoords = async (location: Location): Promise<Location> => {
    return await queryClient.fetchQuery(geocodeQueryOptions(location));
  };

  return { fetchCoords };
}
