const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { ticker_id, request_type } = event.queryStringParameters;
  
  try {
    // Verify the API endpoint is correct
    const apiBase = 'https://www.serenity.exchange/api/v2';
    let apiUrl;
    
    if (request_type === 'orderbook') {
      if (!ticker_id) throw new Error('ticker_id is required');
      apiUrl = `${apiBase}/orderbook/coingecko?ticker_id=${ticker_id}`;
    } else {
      apiUrl = `${apiBase}/trade/coingecko/tickers`;
    }

    console.log(`Fetching from: ${apiUrl}`);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (request_type === 'orderbook') {
      if (!data.bids || !data.asks) {
        throw new Error('Orderbook data structure not found');
      }
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
    console.error('Error:', error.message);
    return {
      statusCode: error.message.includes('required') ? 400 : 500,
      body: JSON.stringify({ 
        error: error.message,
        requested_ticker: ticker_id,
        request_type: request_type
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
