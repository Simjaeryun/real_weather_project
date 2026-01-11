export const ENV = {
  VWORLD: process.env.NEXT_PUBLIC_VWORLD_API_KEY as string,
  WEATHER: process.env.NEXT_PUBLIC_WEATHER_API_KEY as string,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL as string,
  VWORLD_API_URL: process.env.NEXT_PUBLIC_VWORLD_API_URL as string,
} as const;
