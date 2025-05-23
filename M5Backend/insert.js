const mongoose = require("mongoose");
const stations = require("./models/stations");

const metroStations = [
  {
    "station_name": "Versova",
    "opened": "8 June 2014",
    "distance_inter_station_km": 0,
    "distance_from_versova_km": 0,
    "distance_from_ghatkopar_km": 10.821,
    "connections": [],
    "layout": "Elevated"
  },
  {
    "station_name": "D N Nagar",
    "opened": "8 June 2014",
    "distance_inter_station_km": 0.955,
    "distance_from_versova_km": 0.955,
    "distance_from_ghatkopar_km": 9.866,
    "connections": ["Line 2"],
    "layout": "Elevated"
  },
  {
    "station_name": "Azad Nagar",
    "opened": "8 June 2014",
    "distance_inter_station_km": 0.796,
    "distance_from_versova_km": 1.751,
    "distance_from_ghatkopar_km": 9.07,
    "connections": [],
    "layout": "Elevated"
  },
  {
    "station_name": "Andheri",
    "opened": "8 June 2014",
    "distance_inter_station_km": 1.36,
    "distance_from_versova_km": 3.111,
    "distance_from_ghatkopar_km": 7.71,
    "connections": ["Western Line (via Andheri railway station)"],
    "layout": "Elevated"
  },
  {
    "station_name": "Western Express Highway",
    "opened": "8 June 2014",
    "distance_inter_station_km": 1.007,
    "distance_from_versova_km": 4.118,
    "distance_from_ghatkopar_km": 6.703,
    "connections": ["Line 7"],
    "layout": "Elevated"
  },
  {
    "station_name": "Chakala (J B Nagar)",
    "opened": "8 June 2014",
    "distance_inter_station_km": 1.264,
    "distance_from_versova_km": 5.382,
    "distance_from_ghatkopar_km": 5.439,
    "connections": [],
    "layout": "Elevated"
  },
  {
    "station_name": "Airport Road",
    "opened": "8 June 2014",
    "distance_inter_station_km": 0.725,
    "distance_from_versova_km": 6.107,
    "distance_from_ghatkopar_km": 4.714,
    "connections": [],
    "layout": "Elevated"
  },
  {
    "station_name": "Marol Naka",
    "opened": "8 June 2014",
    "distance_inter_station_km": 0.598,
    "distance_from_versova_km": 6.705,
    "distance_from_ghatkopar_km": 4.116,
    "connections": ["Line 3"],
    "layout": "Elevated"
  },
  {
    "station_name": "Saki Naka",
    "opened": "8 June 2014",
    "distance_inter_station_km": 1.075,
    "distance_from_versova_km": 7.78,
    "distance_from_ghatkopar_km": 3.041,
    "connections": [],
    "layout": "Elevated"
  },
  {
    "station_name": "Asalpha",
    "opened": "8 June 2014",
    "distance_inter_station_km": 1.123,
    "distance_from_versova_km": 8.903,
    "distance_from_ghatkopar_km": 1.918,
    "connections": [],
    "layout": "Elevated"
  },
  {
    "station_name": "Jagruti Nagar",
    "opened": "8 June 2014",
    "distance_inter_station_km": 0.862,
    "distance_from_versova_km": 9.765,
    "distance_from_ghatkopar_km": 1.056,
    "connections": [],
    "layout": "Elevated"
  },
  {
    "station_name": "Ghatkopar",
    "opened": "8 June 2014",
    "distance_inter_station_km": 1.056,
    "distance_from_versova_km": 10.821,
    "distance_from_ghatkopar_km": 0,
    "connections": ["Central Line (via Ghatkopar railway station)"],
    "layout": "Elevated"
  }
];

const insertMetroData = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/M5Database", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await MetroStation.deleteMany(); // Clear existing data
    await MetroStation.insertMany(stations);
    console.log("Metro stations inserted successfully!");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting metro stations:", error);
  }
};

insertMetroData();
