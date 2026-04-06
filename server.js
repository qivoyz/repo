const express = require('express');
const https = require('https');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const CFX_CODE = 'xmq5zm';

// Serve static files
app.use(express.static(path.join(__dirname)));

// Proxy endpoint - ambil player count dari Cfx.re API
app.get('/api/players', (req, res) => {
  const options = {
    hostname: 'servers-frontend.fivem.net',
    path: `/api/servers/single/${CFX_CODE}`,
    method: 'GET',
    timeout: 8000,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  };

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try {
        const json = JSON.parse(data);
        const count = json?.Data?.clients ?? 0;
        const maxPlayers = json?.Data?.sv_maxclients ?? 0;
        res.json({ count, maxPlayers, online: true });
      } catch (e) {
        res.json({ count: 0, maxPlayers: 0, online: false });
      }
    });
  });

  request.on('timeout', () => {
    request.destroy();
    res.json({ count: 0, maxPlayers: 0, online: false });
  });

  request.on('error', () => {
    res.json({ count: 0, maxPlayers: 0, online: false });
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
