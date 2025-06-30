const fetch = require('node-fetch');

exports.handler = async (event) => {
  const path = event.path;
  const { ticker_id } = event.queryStringParameters;
  
  try {
    let apiUrl;
    
    if (path.includes('/api/orderbook')) {
      if (!ticker_id) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'ticker_id parameter is required' })
        };
      }
      apiUrl = `https://www.serenity.exchange/api/v2/trade/coingecko/orderbook?ticker_id=${ticker_id}`;
    } else if (path.includes('/api/tickers')) {
      apiUrl = 'https://www.serenity.exchange/api/v2/trade/coingecko/tickers';
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Endpoint not found' })
      };
    }
    
    const response = await fetch(apiUrl);
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
      body: JSON.stringify({ error: error.message })
    };
  }
};
