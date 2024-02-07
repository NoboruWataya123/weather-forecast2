import { CardTitle, CardDescription, Card } from "@/components/ui/card";
import { WeatherData, WeatherForecastResponse } from "@/lib/interfaces";
import { unstable_noStore as noStore } from "next/cache";

async function fetchWeatherForecast(
  lat: number,
  lon: number
): Promise<WeatherForecastResponse> {
  noStore(); // Disable caching for this request
  const apiKey = process.env.WEATHER_API_KEY; // Ensure you have the API key in your environment variables
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }
  return response.json() as Promise<WeatherForecastResponse>;
}

export default async function Home() {
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
                {data.list[0].main.temp}°C
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {data.list[0].weather[0].description}
              </CardDescription>
            </div>
            <CloudIcon className="w-24 h-24 text-gray-600 dark:text-gray-300 mt-4 sm:mt-0" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <DropletIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-600 dark:text-gray-300">
                Влажность: {data.list[0].main.humidity}%{" "}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <WindIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-600 dark:text-gray-300">
                Ветер: {data.list[0].wind.speed} м/с
              </span>
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">
            Прогноз на неделю
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {filterDailyForecast(data.list)
              .slice(0, 5)
              .map((dayForecast, index) => (
                <Card className="p-4" key={index}>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-200">
                    {getDayOfWeek(
                      dayForecast.morning
                        ? dayForecast.morning.dt_txt
                        : dayForecast.afternoon.dt_txt
                    )}
                  </CardTitle>
                  <WeatherIcon
                    id={
                      dayForecast.morning?.weather[0].id ??
                      dayForecast.afternoon?.weather[0].id
                    }
                    className="w-12 h-12 mx-auto text-gray-600 dark:text-gray-300"
                  />
                  <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
                    Утро:{" "}
                    {dayForecast.morning
                      ? dayForecast.morning.main.temp.toFixed(1)
                      : "N/A"}
                    °C
                  </CardDescription>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    День:{" "}
                    {dayForecast.afternoon
                      ? dayForecast.afternoon.main.temp.toFixed(1)
                      : "N/A"}
                    °C
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

function filterDailyForecast(list: WeatherData[]) {
  const dailyData = new Map();
  const timezoneOffset = 9 * 60 * 60 * 1000; // Смещение для GMT+9 в миллисекундах

  list.forEach((item: WeatherData) => {
    const utcDate = new Date(item.dt_txt);
    const localDate = new Date(utcDate.getTime() + timezoneOffset);
    const day = localDate.toISOString().split("T")[0];
    const hour = localDate.getHours();

    // Устанавливаем 6 часов утра для утренней температуры и 15 часов для дневной
    if (!dailyData.has(day)) {
      dailyData.set(day, { morning: null, afternoon: null });
    }

    const dayData = dailyData.get(day);
    if (hour === 6) {
      // Утреннее время
      dayData.morning = item;
    } else if (hour === 15) {
      // Дневное время
      dayData.afternoon = item;
    }
  });

  return Array.from(dailyData.values());
}

function CloudIcon(props: any) {
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
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 0 1 4.5 4.5Z" />
    </svg>
  );
}

function SunIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="-12 -12 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle r="5" />
      <path d="M0 -10 v-4" />
      <path d="M0 10 v4" />
      <path d="M10 0 h4" />
      <path d="M-10 0 h-4" />
      <path d="M7.07 -7.07 l2.83 -2.83" />
      <path d="M-7.07 7.07 l-2.83 2.83" />
      <path d="M7.07 7.07 l2.83 2.83" />
      <path d="M-7.07 -7.07 l-2.83 -2.83" />
    </svg>
  );
}

function DropletIcon(props: any) {
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
      <path d="M12 22a7 7 0 0 1 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5s-3 3.9-3 5.5a7 7 0 0 1 7 7z" />
    </svg>
  );
}

function WindIcon(props: any) {
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

function CloudSunIcon(props: any) {
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
      <path d="M12 2v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="M20 12h2" />
      <path d="m19.07 4.93-1.41 1.41" />
      <path d="M15.947 12.65a4 4 0 0 0 -5.925-4.128" />
      <path d="M13 22H7a5 5 0 0 1 4.9-6H13a3 3 0 0 1 3 3Z" />
    </svg>
  );
}

function CloudRainIcon(props: any) {
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
      <path d="M4 14.899A7 7 0 0 1 15.71 8h1.79a4.5 4.5 0 0 1 4.5 4.5" />
      <path d="M16 14v6" />
      <path d="M8 14v6" />
      <path d="M12 16v6" />
    </svg>
  );
}

function WeatherIcon({ id, ...props }: any) {
  switch (id) {
    case 800: // Clear
      return <SunIcon />;
    case 801: // Few clouds
    case 802: // Scattered clouds
      return <CloudSunIcon />;
    case 803: // Broken clouds
    case 804: // Overcast clouds
      return <CloudIcon />;
    case 300: // Light intensity drizzle
    case 301: // Drizzle
    case 302: // Heavy intensity drizzle
    case 310: // Light intensity drizzle rain
    case 311: // Drizzle rain
    case 312: // Heavy intensity drizzle rain
    case 313: // Shower rain and drizzle
    case 314: // Heavy shower rain and drizzle
    case 321: // Shower drizzle
    case 500: // Light rain
    case 501: // Moderate rain
    case 502: // Heavy intensity rain
    case 503: // Very heavy rain
    case 504: // Extreme rain
    case 511: // Freezing rain
    case 520: // Light intensity shower rain
    case 521: // Shower rain
    case 522: // Heavy intensity shower rain
    case 531: // Ragged shower rain
      return <CloudRainIcon />;
    case 200: // Thunderstorm with light rain
    case 201: // Thunderstorm with rain
    case 202: // Thunderstorm with heavy rain
    case 210: // Light thunderstorm
    case 211: // Thunderstorm
    case 212: // Heavy thunderstorm
    case 221: // Ragged thunderstorm
    case 230: // Thunderstorm with light drizzle
    case 231: // Thunderstorm with drizzle
    case 232: // Thunderstorm with heavy drizzle
      return <WindIcon />;
    default:
      return <CloudIcon />;
  }
}
