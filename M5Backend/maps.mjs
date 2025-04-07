import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const PORT = 5000;

// MongoDB Connection
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db;

async function connectDB() {
  await client.connect();
  db = client.db("mapsDB");
  console.log("Connected to MongoDB");
}

connectDB().catch(console.error);

// Middleware
app.use(express.json());

// API to Get Nearby Places
app.get("/places", async (req, res) => {
  try {
    const { lat, lon, radius } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    const places = await db.collection("locations").find({
      geometry: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] },
          $maxDistance: parseInt(radius) || 1000 // Default 1km radius
        }
      }
    }).toArray();

    res.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API to Serve Map Tiles
app.get("/map/tiles/:z/:x/:y.png", (req, res) => {
  const { z, x, y } = req.params;
  res.redirect(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
