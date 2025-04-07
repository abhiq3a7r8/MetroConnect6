const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());


mongoose.connect("mongodb://localhost:27017/M5Database")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const User = mongoose.model("users", new mongoose.Schema({
  phone: String,
  password: String,
}));

app.post("/login", async (req, res) => {
    console.log(req.body.phone)
  const user = await User.findOne({ phone: req.body.phone });

  if (!user) {
    console.log("User not found:", req.body.phone);
    return res.status(401).json({ success: false, message: "User not found" });
  }

  if (user.password === req.body.password) {
    return res.json({ success: true, message: "Login successful!" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid password" });
  }
});

const Station = mongoose.model("stations", new mongoose.Schema({
  station_name: String,
  opened: String,
  inter_station_distance_km: Number,
  from_versova_km: Number,
  from_ghatkopar_km: Number,
  connections: String,
  layout: String,
}));

app.get("/api/stations", async (req, res) => {
  try {
    const stations = await Station.find({}, "-_id station_name");
    res.json(stations);
  } catch (err) {
    console.error("Error fetching stations:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});