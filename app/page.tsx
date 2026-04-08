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

export default function Home() {
  const [cityIndex, setCityIndex] = useState(0);
  const [temp, setTemp] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(new Date());

  const city = CITIES[cityIndex];

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m`
    )
      .then((r) => r.json())
      .then((data) => {
        setTemp(Math.round(data.current.temperature_2m));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [cityIndex]);

  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center p-8">
      {/* Card */}
      <div
        className="relative w-80 h-80 rounded-3xl overflow-hidden shadow-2xl select-none"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {/* Background image */}
        <img
          src="/bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Top left: date + time */}
        <div className="absolute top-5 left-5 text-white">
          <div className="text-base font-semibold leading-tight">{dateStr}</div>
          <div className="text-base font-semibold leading-tight">{timeStr}</div>
        </div>

        {/* Top right: temperature */}
        <div className="absolute top-3 right-5 text-white text-7xl font-bold leading-none">
          {loading ? "—" : error ? "?" : `${temp}°`}
        </div>

        {/* Bottom left: city */}
        <div className="absolute bottom-5 left-5 text-white">
          <div className="text-2xl font-bold leading-tight">{city.name}</div>
          <div className="text-2xl font-bold leading-tight">{city.country}</div>
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
