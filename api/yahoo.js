// Vercel Serverless Function for Yahoo Finance API Proxy
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
    const urlPath = req.url.split('?')[0].replace('/api/yahoo', '');
    const queryString = req.url.includes('?') ? req.url.split('?')[1] : '';
    const yahooUrl = `https://query1.finance.yahoo.com${urlPath}${queryString ? '?' + queryString : ''}`;

    console.log('Proxying to:', yahooUrl);

    const response = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Yahoo API error:', response.status);
      return res.status(response.status).json({ error: `Yahoo API error: ${response.status}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Yahoo API proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from Yahoo Finance', message: error.message });
  }
};

