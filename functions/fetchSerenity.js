const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Determine if this is an orderbook request
  const isOrderbookRequest = event.rawUrl.includes('/api/orderbook');
  const { ticker_id } = event.queryStringParameters;
  
  try {
    let apiUrl;
    
    if (isOrderbookRequest) {
      // ORDERBOOK ENDPOINT
      if (!ticker_id) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'ticker_id parameter is required for orderbook' }),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        };
      }
      apiUrl = `https://www.serenity.exchange/api/v2/trade/coingecko/orderbook?ticker_id=${ticker_id}`;
    } else {
      // TICKERS ENDPOINT
      apiUrl = 'https://www.serenity.exchange/api/v2/trade/coingecko/tickers';
    }
    
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Serenity API request failed: ${response.statusText}`);
    
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
