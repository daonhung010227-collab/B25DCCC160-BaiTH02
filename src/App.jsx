import { useEffect, useState } from "react";
import { CITIES } from "./data/cities";
import { describeWeather, formatTemp } from "./utils/weather";
import "./App.css";

export default function App() {
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [unit, setUnit] = useState("C");
  const [retry, setRetry] = useState(0);

  // Chỉ phụ thuộc city và retry, KHÔNG có unit => đổi °C/°F không gọi lại API
  useEffect(() => {
    if (!city) return;
    const controller = new AbortController();
    setStatus("loading");

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
      `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
      `&timezone=Asia%2FHo_Chi_Minh&forecast_days=7`;

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then((data) => { setWeather(data); setStatus("success"); })
      .catch((e) => { if (e.name !== "AbortError") setStatus("error"); });

    return () => controller.abort();
  }, [city, retry]);

  const renderMain = () => {
    if (status === "idle") return <p className="status">Hãy chọn một thành phố.</p>;
    if (status === "loading") return <p className="status">Đang tải...</p>;
    if (status === "error")
      return (
        <div className="status error">
          <p>Không tải được dữ liệu.</p>
          <button onClick={() => setRetry((n) => n + 1)}>Thử lại</button>
        </div>
      );

    const cur = weather.current;
    const daily = weather.daily;
    const info = describeWeather(cur.weather_code);

    return (
      <>
        <div className="unit-toggle">
          <button className={unit === "C" ? "on" : ""} onClick={() => setUnit("C")}>°C</button>
          <button className={unit === "F" ? "on" : ""} onClick={() => setUnit("F")}>°F</button>
        </div>

        <section className="card">
          <h2>{city.name}</h2>
          <div className="current-main">
            <span className="big-icon">{info.icon}</span>
            <div>
              <div className="temp">{formatTemp(cur.temperature_2m, unit)}</div>
              <div>{info.text}</div>
            </div>
          </div>
          <p>Độ ẩm: {cur.relative_humidity_2m}%</p>
          <p>Gió: {cur.wind_speed_10m} km/h</p>
          <p className="muted">Cập nhật: {new Date(cur.time).toLocaleString("vi-VN")}</p>
        </section>

        <section className="card">
          <h3>Dự báo 7 ngày</h3>
          <ul className="forecast">
            {daily.time.map((date, i) => {
              const d = new Date(date + "T00:00:00");
              return (
                <li key={date} className="forecast-item">
                  <strong>{d.toLocaleDateString("vi-VN", { weekday: "long" })}</strong>
                  <span>{d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}</span>
                  <span>{describeWeather(daily.weather_code[i]).icon}</span>
                  <span>Cao: {formatTemp(daily.temperature_2m_max[i], unit)}</span>
                  <span>Thấp: {formatTemp(daily.temperature_2m_min[i], unit)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </>
    );
  };

  return (
    <div className="app">
      <h1>Thời tiết Việt Nam</h1>
      <div className="layout">
        <ul className="city-list">
          {CITIES.map((c) => (
            <li key={c.id}>
              <button
                className={c.id === city?.id ? "city active" : "city"}
                onClick={() => setCity(c)}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
        <main>{renderMain()}</main>
      </div>
    </div>
  );
}