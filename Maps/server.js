const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const PORT = 4000;

// Create HTTP server
const server = http.createServer(app);

// Set up WebSocket server
const wss = new WebSocket.Server({ server });

// Store for train data and clients
let trainPosition = null;
const clients = new Set();
let currentStationIndex = 0;
let isMoving = false;

// WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  clients.add(ws);
  
  // Send initial train position if available
  if (trainPosition) {
    ws.send(JSON.stringify({
      type: 'trainUpdate',
      position: trainPosition
    }));
  }
  
  // Handle messages from clients
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
      
      // Handle client commands if needed
      if (data.type === 'command' && data.action === 'startTrain') {
        startTrainMovement();
      }
    } catch (e) {
      console.error('Invalid message format:', e);
    }
  });
  
  // Handle disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

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

// In-memory store of station coordinates (will be populated from GeoJSON)
let stationCoordinates = [];

// Load station data on startup
const fs = require('fs');
try {
  const rawData = fs.readFileSync(path.join(__dirname, 'data', 'stations.geojson'));
  const stationData = JSON.parse(rawData);
  
  stationData.features.forEach(feature => {
    const [lng, lat] = feature.geometry.coordinates;
    stationCoordinates.push({
      lat, lng, 
      name: feature.properties.name
    });
  });
  
  // Initialize train at first station
  if (stationCoordinates.length > 0) {
    trainPosition = {
      lat: stationCoordinates[0].lat,
      lng: stationCoordinates[0].lng,
      stationName: stationCoordinates[0].name,
      nextStationName: stationCoordinates[1]?.name || 'End of Line'
    };
  }
  
  console.log(`Loaded ${stationCoordinates.length} stations`);
} catch (err) {
  console.error('Error loading station data:', err);
}

app.get('/map', (req, res) => {
  if (!currentLocation) {
    return res.status(400).send('No location data available');
  }
  const { lat, lng } = currentLocation;
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Live Train Location Map</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        html, body { margin: 0; padding: 0; height: 100%; }
        #map { height: 100%; }
        .train-icon {
          color: #e91e63;
          font-size: 24px;
          text-shadow: 0 0 3px #fff;
        }
        #status {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1000;
          background: rgba(255,255,255,0.8);
          padding: 5px 10px;
          border-radius: 4px;
          font-family: sans-serif;
        }
        #controls {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          background: rgba(255,255,255,0.8);
          padding: 10px;
          border-radius: 4px;
          text-align: center;
        }
        button {
          padding: 8px 16px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background: #45a049;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div id="status">Connecting...</div>
      <div id="controls">
        <button id="startTrainBtn">Start Train</button>
      </div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        const map = L.map('map').setView([${lat}, ${lng}], 13);
        const statusEl = document.getElementById('status');
        const startTrainBtn = document.getElementById('startTrainBtn');
        let trainMarker;
        let websocket;
        let stationCoordinates = [];
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);
        
        // Add user location marker
        const userMarker = L.marker([${lat}, ${lng}])
          .addTo(map)
          .bindPopup('📍 You are here')
          .openPopup();
        
        // Custom train icon
        const trainIcon = L.divIcon({
          html: '🚆',
          className: 'train-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        
        // Connect to WebSocket
        function connectWebSocket() {
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const wsUrl = protocol + '//' + window.location.host;
          
          websocket = new WebSocket(wsUrl);
          
          websocket.onopen = () => {
            statusEl.textContent = 'Connected';
            statusEl.style.backgroundColor = 'rgba(76, 175, 80, 0.8)';
          };
          
          websocket.onclose = () => {
            statusEl.textContent = 'Disconnected';
            statusEl.style.backgroundColor = 'rgba(244, 67, 54, 0.8)';
            // Try to reconnect after a delay
            setTimeout(connectWebSocket, 3000);
          };
          
          websocket.onerror = (error) => {
            console.error('WebSocket Error:', error);
            statusEl.textContent = 'Connection Error';
            statusEl.style.backgroundColor = 'rgba(244, 67, 54, 0.8)';
          };
          
          websocket.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              
              if (data.type === 'trainUpdate') {
                updateTrainPosition(data.position);
              }
            } catch (e) {
              console.error('Invalid message format:', e);
            }
          };
        }
        
        // Update train position on map
        function updateTrainPosition(position) {
          if (!trainMarker) {
            trainMarker = L.marker([position.lat, position.lng], {
              icon: trainIcon
            }).addTo(map);
          } else {
            trainMarker.setLatLng([position.lat, position.lng]);
          }
          
          trainMarker.bindPopup(\`🚆 Train at \${position.stationName}<br>Next: \${position.nextStationName}\`);
          
          if (trainMarker.isPopupOpen()) {
            trainMarker.openPopup();
          }
          
          statusEl.textContent = \`Train at \${position.stationName}\`;
        }
        
        // Button to start train
        startTrainBtn.addEventListener('click', () => {
          if (websocket && websocket.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify({
              type: 'command',
              action: 'startTrain'
            }));
            startTrainBtn.disabled = true;
            startTrainBtn.textContent = 'Train Running';
          }
        });
        
        // Fetch and display stations from GeoJSON
        fetch('/data/stations')
          .then(response => response.json())
          .then(data => {
            // Add stations to map
            L.geoJSON(data, {
              pointToLayer: function(feature, latlng) {
                return L.marker(latlng)
                  .bindPopup(feature.properties.name || 'Station');
              }
            }).addTo(map);
            
            // Extract station coordinates for reference
            data.features.forEach(feature => {
              const [lng, lat] = feature.geometry.coordinates;
              stationCoordinates.push({
                lat, lng, 
                name: feature.properties.name
              });
            });
            
            // Draw the route line between stations
            const routeCoords = stationCoordinates.map(coord => [coord.lat, coord.lng]);
            const routeLine = L.polyline(routeCoords, {color: '#0D47A1', weight: 5}).addTo(map);
            
            // Connect WebSocket after loading station data
            connectWebSocket();
          })
          .catch(error => {
            console.error('Error loading stations:', error);
            statusEl.textContent = 'Error loading stations';
            statusEl.style.backgroundColor = 'rgba(244, 67, 54, 0.8)';
          });
      </script>
    </body>
    </html>
  `);
});

// Function to start train movement simulation
function startTrainMovement() {
  if (isMoving) return;
  isMoving = true;
  
  // Already loaded the stations during startup
  if (stationCoordinates.length < 2) {
    console.error('Not enough station data to simulate movement');
    return;
  }
  
  moveToNextStation();
}

// Function to move train to next station
function moveToNextStation() {
  const nextStationIndex = (currentStationIndex + 1) % stationCoordinates.length;
  
  const currentStation = stationCoordinates[currentStationIndex];
  const nextStation = stationCoordinates[nextStationIndex];
  const nextNextStation = stationCoordinates[(nextStationIndex + 1) % stationCoordinates.length];
  
  console.log(`Train moving from ${currentStation.name} to ${nextStation.name}`);
  
  // Animate movement between stations
  animateTrainMovement(
    currentStation,
    nextStation,
    nextNextStation.name,
    5000, // 5 seconds per station
    () => {
      // Update current station after reaching destination
      currentStationIndex = nextStationIndex;
      // Schedule next movement
      setTimeout(moveToNextStation, 2000); // 2 second pause at station
    }
  );
}

// Function to animate train movement between stations
function animateTrainMovement(startStation, endStation, nextStationName, duration, callback) {
  const startTime = Date.now();
  const startPos = { lat: startStation.lat, lng: startStation.lng };
  const endPos = { lat: endStation.lat, lng: endStation.lng };
  
  // Send position updates at regular intervals
  const intervalId = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Calculate current position with easing
    const lat = startPos.lat + (endPos.lat - startPos.lat) * progress;
    const lng = startPos.lng + (endPos.lng - startPos.lng) * progress;
    
    // Update train position
    trainPosition = {
      lat,
      lng,
      stationName: progress < 1 ? `Between ${startStation.name} and ${endStation.name}` : endStation.name,
      nextStationName: nextStationName || 'End of Line'
    };
    
    // Broadcast to all connected clients
    broadcastTrainPosition();
    
    // End the interval when animation completes
    if (progress >= 1) {
      clearInterval(intervalId);
      if (callback) callback();
    }
  }, 100); // Update every 100ms for smooth movement
}

// Function to broadcast train position to all connected clients
function broadcastTrainPosition() {
  if (!trainPosition) return;
  
  const message = JSON.stringify({
    type: 'trainUpdate',
    position: trainPosition
  });
  
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Start the server
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});