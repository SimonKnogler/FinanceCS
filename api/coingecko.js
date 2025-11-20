// Vercel Serverless Function for CoinGecko API Proxy
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Extract path from URL
    const urlPath = req.url.split('?')[0].replace('/api/coingecko', '');
    const queryString = req.url.includes('?') ? req.url.split('?')[1] : '';
    const coingeckoUrl = `https://api.coingecko.com/api/v3${urlPath}${queryString ? '?' + queryString : ''}`;

    console.log('Proxying to:', coingeckoUrl);

    const response = await fetch(coingeckoUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('CoinGecko API error:', response.status);
      return res.status(response.status).json({ error: `CoinGecko API error: ${response.status}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('CoinGecko API proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from CoinGecko', message: error.message });
  }
};

