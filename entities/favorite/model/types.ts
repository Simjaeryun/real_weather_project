import type { Location } from "@/entities/location";

export interface Favorite {
  id: string; // location.id
  location: Location;
  alias: string; // 사용자 지정 별칭
  addedAt: string; // ISO 날짜
}

export const MAX_FAVORITES = 6;
