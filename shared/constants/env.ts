export const ENV = {
  VWORLD_API_KEY: process.env.NEXT_PUBLIC_VWORLD_API_KEY || "",
  VWORLD_API_URL: process.env.NEXT_PUBLIC_VWORLD_API_URL || "",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "",
  WEATHER_API_URL: process.env.NEXT_PUBLIC_WEATHER_API_URL || "",
} as const;
