// server.js
require("dotenv").config();

const express = require("express");
const morgan = require("morgan"); // logging middleware

const app = express();
const PORT = process.env.PORT || 3000;

// -----------------------------
// MIDDLEWARE
// -----------------------------
app.use(express.json());
app.use(morgan("dev")); // logs every request nicely

// -----------------------------
// HEALTH CHECK ROUTE
// -----------------------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running 🚀",
    time: new Date().toISOString(),
  });
});

// -----------------------------
// WEATHER BY COORDS
// -----------------------------
app.get("/api/weather/coords", async (req, res) => {
  const startTime = Date.now();

  try {
    const { lat, lon } = req.query;
    const { API_KEY } = process.env;

    console.log("📍 Request: Weather by coords", { lat, lon });

    if (!lat || !lon) {
      return res.status(400).json({
        error: "Latitude and longitude are required",
      });
    }

    if (!API_KEY) {
      throw new Error("API key is missing in .env");
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error("Failed to fetch weather from API");
    }

    const currentWeather = await currentRes.json();
    const forecast = await forecastRes.json();

    console.log(`✅ Success (coords) in ${Date.now() - startTime}ms`);

    res.json({
      source: "coords",
      currentWeather,
      forecast,
    });

  } catch (error) {
    console.error("❌ Error (coords):", error.message);

    res.status(500).json({
      error: "Failed to fetch weather data",
      details: error.message,
    });
  }
});

// -----------------------------
// WEATHER BY CITY
// -----------------------------
app.get("/api/weather/:city", async (req, res) => {
  const startTime = Date.now();

  try {
    const { city } = req.params;
    const { API_KEY } = process.env;

    console.log("🏙 Request: Weather by city", city);

    if (!API_KEY) {
      throw new Error("API key is missing in .env");
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error("City not found or API error");
    }

    const currentWeather = await currentRes.json();
    const forecast = await forecastRes.json();

    console.log(`✅ Success (city: ${city}) in ${Date.now() - startTime}ms`);

    res.json({
      source: "city",
      city,
      currentWeather,
      forecast,
    });

  } catch (error) {
    console.error("❌ Error (city):", error.message);

    res.status(500).json({
      error: "Failed to fetch weather data",
      details: error.message,
    });
  }
});

// -----------------------------
// 404 HANDLER
// -----------------------------
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use((req, res, next) => {
  console.log("➡️ Incoming request:", req.method, req.url);
  next();
});
// -----------------------------
// START SERVER
// -----------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});