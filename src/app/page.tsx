import Image from "next/image";

async function getData() {
  const res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=Yakutsk&days=3&aqi=no&alerts=no&lang=ru`,
    { next: { revalidate: 60 } }
  );
  const data = await res.json();
  return data;
}

const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  const monthNames = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  const dayNames = [
    "воскресенье",
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота",
  ];
  return `${dayNames[date.getDay()]}, ${date.getDate()} ${
    monthNames[date.getMonth()]
  }`;
};

const adjustTimeZone = (utcDateString: any) => {
  let date = new Date(utcDateString);
  date = new Date(date.getTime() + 9 * 60 * 60 * 1000); // Adjust for UTC+9
  return date;
};

export default async function Home() {
  const data = await getData();

  return (
    <div className="h-screen bg-gradient-to-r from-blue-400 to-blue-600 flex flex-col items-center justify-center text-white">
      <div className="bg-opacity-50 bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl">
            {data.location.name}, {data.location.country}
          </h2>
          <Image
            src={"https:" + data.current.condition.icon}
            alt={data.current.condition.text}
            width={72}
            height={72}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-3xl">{data.current.temp_c}°C</p>
          <p>{data.current.condition.text}</p>
        </div>
        <hr className="my-6 border-t border-white border-opacity-20" />
        {data.forecast.forecastday.map((day: any) => (
          <div key={day.date} className="mb-8 text-center">
            <h3 className="text-2xl mb-4">{formatDate(day.date)}</h3>
            <div className="flex justify-between flex-wrap">
              {/*it returns time in utc so when i show weather its gets a night and late morning the most warm time, my timezone is UTC+9*/}
              {day.hour
                .filter((hour: any) => {
                  const adjustedTime = adjustTimeZone(hour.time);
                  return [6, 12, 18, 21].includes(adjustedTime.getHours());
                })
                .map((filteredHour: any) => (
                  <div
                    key={filteredHour.time}
                    className="flex flex-col items-center w-1/4 mb-4"
                  >
                    <Image
                      src={"https:" + filteredHour.condition.icon}
                      alt={filteredHour.condition.text}
                      width={32}
                      height={32}
                    />
                    <div className="bg-white bg-opacity-20 p-2 rounded">
                      <p className="text-xl">{filteredHour.temp_c}°C</p>
                    </div>
                    <p className="text-xl">
                      {adjustTimeZone(filteredHour.time).getHours()} ч
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
