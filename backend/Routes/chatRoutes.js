const express = require("express");
const Farmer = require("../models/user"); // your Farmer model
const router = express.Router();
// Utility: get lat/lon from city/state using OpenCage Geocoding
const getLatLon = async (city, state) => {
  try {
    const API_KEY = process.env.OPENCAGE_KEY; // get free API key
    const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city},${state}&key=${API_KEY}`);
    const data = await res.json();
    if (data.results.length > 0) {
      return data.results[0].geometry;
    }
  } catch (err) {
    console.error("Geocoding failed:", err.message);
  }
  // fallback
  return { lat: 0, lng: 0 };
};

// Utility: fetch soil data from SoilGrids with fallback
const getSoilData = async (lat, lon) => {
  try {
    const res = await fetch(`https://rest.soilgrids.org/query?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    return {
      soilType: data.soil?.[0]?.name || "Unknown",
      pH: data.phh2o?.mean?.[0] || "Unknown",
      organicCarbon: data.organiccarbon?.mean?.[0] || "Unknown",
    };
  } catch (err) {
    console.warn("SoilGrids API unreachable. Using fallback data.");
    return {
      soilType: "Loam",
      pH: 6.5,
      organicCarbon: 1.2,
    };
  }
};

// Utility: fetch weather from OpenWeatherMap
const getWeather = async (lat, lon) => {
  try {
    const API_KEY = process.env.OPENWEATHER_KEY;
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await res.json();
    return {
      temp: data.main?.temp || 0,
      humidity: data.main?.humidity || 0,
      description: data.weather?.[0]?.description || "Unknown",
    };
  } catch (err) {
    console.warn("Weather API failed. Using fallback.");
    return {
      temp: 30,
      humidity: 50,
      description: "Clear",
    };
  }
};

// ✅ Chat endpoint
router.post("/", async (req, res) => {
  try {
    const { email, question } = req.body;

    // 1️⃣ Get farmer info
    const farmer = await Farmer.findOne({ email });
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });

    // 2️⃣ Get lat/lon
    const { lat, lng } = await getLatLon(farmer.city, farmer.state);

    // 3️⃣ Get soil & weather data
    const soil = await getSoilData(lat, lng);
    const weather = await getWeather(lat, lng);

    // 4️⃣ Prepare system message for Groq LLM
    const systemMessage = `
      You are an AI assistant for a farmer.
      Farmer is located in ${farmer.city}, ${farmer.state}, growing ${farmer.crop}.
      Current weather: Temperature ${weather.temp}°C, ${weather.description}, Humidity ${weather.humidity}%.
      Soil data: Soil type ${soil.soilType}, pH ${soil.pH}, Organic Carbon ${soil.organicCarbon}.
      Answer in English and give practical farming advice based on location, soil, weather, and crop type.
    `;

    // 5️⃣ Call Groq LLM
    const response = await fetch("https://api.groq.ai/v1/llm/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "groq-llm-text-1",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();

    res.json({
      answer: data.choices[0].message.content,
      soil,
      weather
    });

  } catch (err) {
    console.error("Chat endpoint failed:", err);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

module.exports = router;
