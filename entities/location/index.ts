// 클라이언트용
export {
  searchLocationsClient,
  getLocationByIdClient,
} from "./api/location-api";
export { geocodeLocation } from "./api/geocode-client";

// 서버용
export { getLocations, getLocationById } from "./api/location-server";

// 공통
export { parseAddress } from "./lib/parser";
export type { Location, LocationSearchResult } from "./model/types";
