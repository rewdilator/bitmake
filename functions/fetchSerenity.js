const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { ticker_id } = event.queryStringParameters;
  const isOrderbook = event.path.includes('/orderbook') || event.rawUrl.includes('/orderbook');

  try {
    const apiUrl = isOrderbook
      ? `https://www.serenity.exchange/api/v2/trade/coingecko/orderbook?ticker_id=${ticker_id}`
      : 'https://www.serenity.exchange/api/v2/trade/coingecko/tickers';

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    
    const data = await response.json();
    
    if (isOrderbook && (!data.bids || !data.asks)) {
      throw new Error('Invalid orderbook data structure');
    }

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
