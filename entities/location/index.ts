// Hooks
export { useLocationCoords } from "./model/location.hook";
export { useReverseGeocode } from "./model/reverse-geocode.hook";

// Queries
export { useGeocodeQuery, geocodeQueryOptions } from "./api/location.query";

// Location API
export {
  getLocations,
  getLocationById,
  searchLocations,
  geocodeLocation,
  fetchGeocode,
  reverseGeocode,
} from "./api/location.api";

// Utils
export { parseAddress } from "./lib/parser";

// Types
export type {
  Location,
  VWorldResponse,
  VWorldReverseResponse,
} from "./model/types";
