const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { ticker_id } = event.queryStringParameters;
  
  try {
    let apiUrl;
    
    if (ticker_id) {
      // This is an orderbook request
      apiUrl = `https://www.serenity.exchange/api/v2/trade/coingecko/orderbook?ticker_id=${ticker_id}`;
    } else {
      // This is a tickers request
      apiUrl = 'https://www.serenity.exchange/api/v2/trade/coingecko/tickers';
    }
    
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
