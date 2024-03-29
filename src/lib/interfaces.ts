export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Clouds {
  all: number;
}

export interface Sys {
  pod: string;
}

export interface WeatherData {
  // dt: number;
  // main: Main;
  // weather: Weather[];
  // clouds: Clouds;
  // wind: Wind;
  // visibility: number;
  // pop: number;
  // sys: Sys;
  // dt_txt: string;
  // daily: {
  //   time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
  //     (t) => new Date((t + utcOffsetSeconds) * 1000)
  //   ),
  //   temperature2mMax: daily.variables(0)!.valuesArray()!,
  //   temperature2mMin: daily.variables(1)!.valuesArray()!,
  //   windSpeed10mMax: daily.variables(2)!.valuesArray()!,
  // },
  daily: {
    time: Date[];
    temperature2mMax: number[];
    temperature2mMin: number[];
    windSpeed10mMax: number[];
  };
}

export interface City {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface WeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherData[];
  city: City;
}