const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { endpoint, ticker_id } = event.queryStringParameters;
  
  try {
    // Validate request
    if (endpoint === 'orderbook' && !ticker_id) {
      throw new Error('ticker_id parameter is required for orderbook');
    }

    // Build the correct API URL
    let apiUrl;
    if (endpoint === 'orderbook') {
      apiUrl = `https://www.serenity.exchange/api/v2/trade/coingecko/orderbook?ticker_id=${ticker_id}`;
    } else {
      apiUrl = 'https://www.serenity.exchange/api/v2/trade/coingecko/tickers';
    }

    // Fetch from Serenity API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Serenity API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Verify we got the expected response format
    if (endpoint === 'orderbook' && (!data.bids || !data.asks)) {
      throw new Error('Unexpected response format from orderbook endpoint');
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
      statusCode: error.message.includes('required') ? 400 : 500,
      body: JSON.stringify({ 
        error: error.message,
        details: endpoint === 'orderbook' ? { requested_ticker: ticker_id } : null
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
