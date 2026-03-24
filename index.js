const express = require("express");
const cors = require("cors");
const fetch = global.fetch;

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Haversine formula for distance
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const techs = [
  {
    id: 1,
    name: "Rapid RV Repair",
    city: "Phoenix",
    state: "AZ",
    lat: 33.4484,
    lon: -112.074,
    services: ["mobile", "emergency"],
    phone: "602-555-1234",
    description: "Fast mobile RV repair for electrical and plumbing issues."
  },
  {
    id: 2,
    name: "Lone Star RV Service",
    city: "Dallas",
    state: "TX",
    lat: 32.7767,
    lon: -96.797,
    services: ["shop"],
    phone: "214-555-5678",
    description: "Full-service RV shop with diagnostics and repairs."
  },
  {
    id: 3,
    name: "Pacific RV Techs",
    city: "San Diego",
    state: "CA",
    lat: 32.7157,
    lon: -117.1611,
    services: ["mobile"],
    phone: "619-555-9012",
    description: "Mobile RV technicians specializing in on-site repairs."
  },
  {
    id: 4,
    name: "Mountain RV Rescue",
    city: "Denver",
    state: "CO",
    lat: 39.7392,
    lon: -104.9903,
    services: ["emergency"],
    phone: "303-555-2222",
    description: "Emergency RV repair services available 24/7."
  },
  {
    id: 5,
    name: "Sunshine RV Care",
    city: "Orlando",
    state: "FL",
    lat: 28.5383,
    lon: -81.3792,
    services: ["mobile", "shop"],
    phone: "407-555-3333",
    description: "Mobile and shop services for all RV types."
  },
  {
    id: 6,
    name: "Great Lakes RV Repair",
    city: "Chicago",
    state: "IL",
    lat: 41.8781,
    lon: -87.6298,
    services: ["shop"],
    phone: "312-555-4444",
    description: "Trusted RV repair shop near downtown Chicago."
  },
  {
    id: 7,
    name: "Desert Mobile RV",
    city: "Las Vegas",
    state: "NV",
    lat: 36.1699,
    lon: -115.1398,
    services: ["mobile", "emergency"],
    phone: "702-555-5555",
    description: "Quick-response mobile RV technicians."
  },
  {
    id: 8,
    name: "Northwest RV Pros",
    city: "Seattle",
    state: "WA",
    lat: 47.6062,
    lon: -122.3321,
    services: ["mobile"],
    phone: "206-555-6666",
    description: "Reliable RV repair with fast turnaround."
  },
  {
    id: 9,
    name: "Atlantic RV Services",
    city: "Atlanta",
    state: "GA",
    lat: 33.749,
    lon: -84.388,
    services: ["shop", "emergency"],
    phone: "404-555-7777",
    description: "Emergency and in-shop RV repair specialists."
  },
  {
    id: 10,
    name: "Northeast RV Repair",
    city: "Boston",
    state: "MA",
    lat: 42.3601,
    lon: -71.0589,
    services: ["shop"],
    phone: "617-555-8888",
    description: "Experienced RV repair technicians in Boston."
  }
];

// GET techs with distance + filtering
app.get("/api/techs", (req, res) => {
  const { lat, lon, service } = req.query;

  let results = techs.map(t => ({
    ...t,
    distance: lat && lon
      ? getDistance(Number(lat), Number(lon), t.lat, t.lon)
      : null
  }));

  if (service) {
    results = results.filter(t => t.services.includes(service));
  }

  results.sort((a, b) => (a.distance || 9999) - (b.distance || 9999));

  res.json(results.slice(0, 5));
});

app.get("/api/geocode", async (req, res) => {
  try {
    let query = req.query.q;

    // Force US for ZIPs
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

    // ✅ CRITICAL: prevent crashes
    if (!data || data.length === 0) {
      return res.json([]);
    }

    res.json(data);

  } catch (err) {
    console.error("GEOCODE ERROR:", err);
    res.json([]); // NEVER crash
  }
});

  try {
    const response = await global.fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=us`,
      {
    headers: {
      "User-Agent": "rv-repair-app"
    }
  }
);

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Geocoding failed" });
  }
});

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Geocoding failed" });
  }
});

app.listen(PORT, () => console.log("Server running on " + PORT));
