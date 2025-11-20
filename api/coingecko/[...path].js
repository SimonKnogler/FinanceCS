// Catch-all CoinGecko API proxy for Vercel
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const pathParam = req.query.path;
    const extraPath = Array.isArray(pathParam) ? `/${pathParam.join('/')}` : '';
    const queryString = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const targetUrl = `https://api.coingecko.com/api/v3${extraPath}${queryString}`;

    console.log('Proxying CoinGecko request to:', targetUrl);

    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('CoinGecko API error:', response.status, targetUrl);
      return res.status(response.status).json({ error: `CoinGecko API error: ${response.status}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('CoinGecko API proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from CoinGecko', message: error.message });
  }
};

