const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Simple, stable geocode route
app.get("/api/geocode", async (req, res) => {
  try {
    let query = req.query.q;

    // Force US for ZIP codes
    if (/^\d{5}$/.test(query)) {
      query = `${query}, USA`;
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=us`,
      {
        headers: {
          "User-Agent": "rv-repair-app"
        }
      }
    );

    const data = await response.json();

    // Never crash backend
    if (!data || data.length === 0) {
      return res.json([]);
    }

    res.json(data);

  } catch (err) {
    console.error("GEOCODE ERROR:", err);
    res.json([]);
  }
});

app.listen(PORT, () => console.log("Server running on " + PORT));
