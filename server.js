const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const FIVEM_SERVER = 'http://151.243.226.73:30120';

// Serve static files
app.use(express.static(path.join(__dirname)));

// Proxy endpoint untuk player count (elak CORS/mixed content)
app.get('/api/players', async (req, res) => {
  try {
    const response = await fetch(`${FIVEM_SERVER}/players.json`, {
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) throw new Error('Server tidak respond');
    const players = await response.json();
    const count = Array.isArray(players) ? players.length : 0;
    res.json({ count });
  } catch (e) {
    res.status(503).json({ count: 0, error: e.message });
  }
});

// Serve index.html for all routes (MESTI letak SELEPAS /api/players)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Zero Roleplay Website running on port ${PORT}`);
});
