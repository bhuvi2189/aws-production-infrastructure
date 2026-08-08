// src/types/weather.ts
export interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  humidity: number;
  wind_kph: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  feelslike_c: number;
  feelslike_f: number;
  uv: number;
  vis_km: number;
  last_updated: string;
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    avgvis_km: number;
    avghumidity: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    uv: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
  };
  hour: HourlyForecast[];
}

export interface HourlyForecast {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_kph: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  humidity: number;
  feelslike_c: number;
  feelslike_f: number;
  chance_of_rain: number;
  chance_of_snow: number;
  uv: number;
}

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
    localtime_epoch: number;
  };
  current: CurrentWeather;
  forecast?: {
    forecastday: ForecastDay[];
  };
}

export interface SearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

export interface FavoriteCity {
  id: number;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface AppSettings {
  isCelsius: boolean;
  refreshInterval: number;
  theme: 'light' | 'dark' | 'auto';
}

export interface ChartData {
  time: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  uvIndex: number;
}