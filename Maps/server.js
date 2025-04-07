const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;

// Middleware to parse JSON body
app.use(express.json());

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// Serve GeoJSON file
app.get('/data/stations', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'stations.geojson'));
});

app.post('/api/route', (req, res) => {
  const { origin, destination } = req.body;

  if (
    !origin || !destination ||
    typeof origin.lat !== 'number' ||
    typeof origin.lng !== 'number' ||
    typeof destination.lat !== 'number' ||
    typeof destination.lng !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid origin or destination format' });
  }

  console.log('📍 Origin:', origin);
  console.log('📍 Destination:', destination);

  // Example response — customize this logic as needed
  const routeData = {
    success: true,
    message: 'Route received',
    data: {
      origin,
      destination,
      distance: '12.5 km', // mock value
      duration: '24 mins', // mock value
    }
  };

  res.json(routeData);
});

let currentLocation = null;


app.post('/api/location', (req, res) => {
  const { lat, lng } = req.body;

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'Invalid location format' });
  }

  currentLocation = { lat, lng };
  console.log('📌 Current User Location:', currentLocation);

  // Redirect to map view
  res.redirect('/map');
});

app.get('/map', (req, res) => {
  if (!currentLocation) {
    return res.status(400).send('No location data available');
  }

  const { lat, lng } = currentLocation;

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Current Location Map</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        html, body { margin: 0; padding: 0; height: 100%; }
        #map { height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        const map = L.map('map').setView([${lat}, ${lng}], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        L.marker([${lat}, ${lng}])
          .addTo(map)
          .bindPopup('📍 You are here')
          .openPopup();
      </script>
    </body>
    </html>
  `);
});




app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
