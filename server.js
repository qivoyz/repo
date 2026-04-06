const express = require('express');
const http = require('http');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const FIVEM_IP = '151.243.226.73';
const FIVEM_PORT = 30120;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Proxy endpoint - fetch player count dari backend (elak CORS)
app.get('/api/players', (req, res) => {
  const options = {
    hostname: FIVEM_IP,
    port: FIVEM_PORT,
    path: '/players.json',
    method: 'GET',
    timeout: 5000
  };

  const request = http.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try {
        const players = JSON.parse(data);
        const count = Array.isArray(players) ? players.length : 0;
        res.json({ count, online: true });
      } catch (e) {
        res.json({ count: 0, online: false });
      }
    });
  });

  request.on('timeout', () => {
    request.destroy();
    res.json({ count: 0, online: false });
  });

  request.on('error', () => {
    res.json({ count: 0, online: false });
  });

  request.end();
});

// Serve index.html (MESTI letak lepas /api routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Zero Roleplay Website running on port ${PORT}`);
});
