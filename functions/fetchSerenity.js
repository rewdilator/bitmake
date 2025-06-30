const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Determine which endpoint was called
  const isOrderbook = event.rawUrl.includes('/api/orderbook');
  const ticker_id = event.queryStringParameters.ticker_id;

  try {
    const apiUrl = isOrderbook
      ? `https://www.serenity.exchange/api/v2/trade/coingecko/orderbook?ticker_id=${ticker_id}`
      : 'https://www.serenity.exchange/api/v2/trade/coingecko/tickers';

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
    
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
