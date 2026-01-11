// ------------------------------------------------------------
// API

export {
  fetchWeatherData,
  getWeatherDescription,
  getWeatherEmoji,
} from "./api/weather-api";

// ------------------------------------------------------------
// QUERIES

export { useWeather, usePrefetchWeather } from "./model/queries";

// ------------------------------------------------------------
// TYPES

export type {
  CurrentWeather,
  DailyWeather,
  HourlyWeather,
  WeatherData,
} from "./model/types";
