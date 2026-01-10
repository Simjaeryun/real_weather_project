export interface CurrentWeather {
  temp: number; // 현재 기온
  humidity: number; // 습도
  weatherCode: number; // 날씨 코드 (WMO)
  windSpeed: number; // 풍속
}

export interface DailyWeather {
  date: string; // ISO 날짜
  tempMin: number; // 최저 기온
  tempMax: number; // 최고 기온
  weatherCode: number; // 날씨 코드
}

export interface HourlyWeather {
  time: string; // ISO 시간
  temp: number; // 기온
  weatherCode: number; // 날씨 코드
}

export interface WeatherData {
  locationName: string;
  current: CurrentWeather;
  daily: DailyWeather; // 당일 날씨
  hourly: HourlyWeather[]; // 24시간 예보
  updatedAt: string;
}

/**
 * Open-Meteo API 응답 타입
 * @see https://open-meteo.com/en/docs
 */
export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}
