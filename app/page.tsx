"use client";

import { useState, useEffect } from "react";

const CITIES = [
  { name: "Lofoten", country: "Norway", lat: 68.15, lon: 13.99 },
  { name: "Tokyo", country: "Japan", lat: 35.68, lon: 139.69 },
  { name: "New York", country: "USA", lat: 40.71, lon: -74.01 },
  { name: "London", country: "UK", lat: 51.51, lon: -0.13 },
  { name: "Paris", country: "France", lat: 48.85, lon: 2.35 },
  { name: "Sydney", country: "Australia", lat: -33.87, lon: 151.21 },
  { name: "Beijing", country: "China", lat: 39.91, lon: 116.39 },
  { name: "Shanghai", country: "China", lat: 31.23, lon: 121.47 },
];

function aqiLabel(aqi: number) {
  if (aqi <= 20) return "Good";
  if (aqi <= 40) return "Fair";
  if (aqi <= 60) return "Moderate";
  if (aqi <= 80) return "Poor";
  if (aqi <= 100) return "Very Poor";
  return "Hazardous";
}

export default function Home() {
  const [cityIndex, setCityIndex] = useState(0);
  const [temp, setTemp] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [aqi, setAqi] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  const city = CITIES[cityIndex];

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTemp(null);
    setHumidity(null);
    setAqi(null);

    const weatherFetch = fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m`
    ).then((r) => r.json());

    const aqiFetch = fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&current=european_aqi`
    ).then((r) => r.json());

    Promise.all([weatherFetch, aqiFetch])
      .then(([weather, air]) => {
        setTemp(Math.round(weather.current.temperature_2m));
        setHumidity(weather.current.relative_humidity_2m);
        setAqi(Math.round(air.current.european_aqi));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cityIndex]);

  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center p-8">
      <div
        className="relative w-80 h-80 rounded-3xl overflow-hidden shadow-2xl select-none"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        <img src="/bg.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />

        {/* Top left: date + time */}
        <div className="absolute top-5 left-5 text-white">
          <div className="text-base font-semibold leading-tight">{dateStr}</div>
          <div className="text-base font-semibold leading-tight">{timeStr}</div>
        </div>

        {/* Top right: temperature */}
        <div className="absolute top-3 right-5 text-white text-7xl font-bold leading-none">
          {loading ? "—" : temp !== null ? `${temp}°` : "?"}
        </div>

        {/* Bottom left: city */}
        <div className="absolute bottom-5 left-5 text-white">
          <div className="text-2xl font-bold leading-tight">{city.name}</div>
          <div className="text-2xl font-bold leading-tight">{city.country}</div>
        </div>

        {/* Bottom right: humidity + AQI */}
        <div className="absolute bottom-5 right-5 flex flex-col items-end gap-1">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5 text-white text-xs font-medium">
            {loading ? "—" : humidity !== null ? `Humidity ${humidity}%` : "?"}
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5 text-white text-xs font-medium">
            {loading ? "—" : aqi !== null ? `AQI ${aqi} · ${aqiLabel(aqi)}` : "?"}
          </div>
        </div>
      </div>

      {/* City selector */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-sm">
        {CITIES.map((c, i) => (
          <button
            key={i}
            onClick={() => setCityIndex(i)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              i === cityIndex
                ? "bg-zinc-800 text-white"
                : "bg-white text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
