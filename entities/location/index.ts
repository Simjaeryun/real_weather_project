// Hooks
export { useLocationCoords } from "./model/location.hook";

// Queries
export { useGeocodeQuery, geocodeQueryOptions } from "./api/location.query";

// Location API
export {
  getLocations,
  getLocationById,
  searchLocations,
  geocodeLocation,
  fetchGeocode,
} from "./api/location.api";

// Utils
export { parseAddress } from "./lib/parser";

// Types
export type { Location, VWorldResponse } from "./model/types";
