import { CardTitle, CardDescription, Card } from "@/components/ui/card";
import { WeatherData, WeatherForecastResponse } from "@/lib/interfaces";
import { fetchWeatherApi } from 'openmeteo';
import { unstable_noStore } from 'next/cache';

export default async function Home() {
  async function fetchWeatherForecast(lat: number, lon: number) {
    "use server";
    unstable_noStore();
    const params = {
      "latitude": lat,
      "longitude": lon,
      "daily": ["temperature_2m_max", "temperature_2m_min", "wind_speed_10m_max"],
      "wind_speed_unit": "ms",
      "timezone": "Asia/Yakutsk"
    };
  
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    // const timezone = response.timezone();
    // const timezoneAbbreviation = response.timezoneAbbreviation();
    // const latitude = response.latitude();
    // const longitude = response.longitude();
    
    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
  
    const daily = response.daily()!;
    const weatherData: WeatherData = {
      daily: {
        time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
          (t) => new Date((t + utcOffsetSeconds) * 1000)
        ),
        temperature2mMax: Array.from(daily.variables(0)!.valuesArray()!),
        temperature2mMin: Array.from(daily.variables(1)!.valuesArray()!),
        windSpeed10mMax: Array.from(daily.variables(2)!.valuesArray()!),
      },
    };
  
    return weatherData;
  }
  
  const data = await fetchWeatherForecast(62.035452, 129.675476);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="w-full max-w-2xl p-4 mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
            Прогноз погоды
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 sm:mt-0">
            Якутск
          </p>
        </div>
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <CardTitle className="text-5xl font-bold text-gray-900 dark:text-gray-200">
                {data.daily.temperature2mMax[0].toFixed(1)}°C
              </CardTitle>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <WindIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-600 dark:text-gray-300">
                Ветер: {data.daily.windSpeed10mMax[0].toFixed(1)} м/с
              </span>
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">
            Прогноз на неделю
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {data.daily.time.map((dayForecast, index) => (
              <Card className="p-4" key={index}>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-200">
                  {getDayOfWeek(dayForecast.toISOString())}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
                  Макс: {data.daily.temperature2mMax[index].toFixed(1)}°C
                </CardDescription>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Мин: {data.daily.temperature2mMin[index].toFixed(1)}°C
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function getDayOfWeek(dateString: string) {
  const date = new Date(dateString);
  const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  return days[date.getDay()];
}

function WindIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.7 7.7a2.5 2.5 0 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 14 16H2" />
    </svg>
  );
}