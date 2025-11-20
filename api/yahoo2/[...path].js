// Catch-all Yahoo Finance (query2) API proxy for Vercel
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
    const yahooUrl = `https://query2.finance.yahoo.com${extraPath}${queryString}`;

    console.log('Proxying Yahoo2 request to:', yahooUrl);

    const response = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Yahoo2 API error:', response.status, yahooUrl);
      return res.status(response.status).json({ error: `Yahoo API error: ${response.status}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Yahoo2 API proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from Yahoo Finance', message: error.message });
  }
};

