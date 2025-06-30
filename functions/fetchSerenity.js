const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { ticker_id } = event.queryStringParameters;
  
  try {
    if (!ticker_id) {
      throw new Error('ticker_id parameter is required');
    }

    const apiUrl = `https://www.serenity.exchange/api/v2/orderbook/coingecko?ticker_id=${ticker_id}`;
    
    console.log(`Fetching orderbook from: ${apiUrl}`);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Orderbook API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.bids || !data.asks) {
      throw new Error('Orderbook data structure not found in response');
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
    console.error('Orderbook Error:', error.message);
    return {
      statusCode: error.message.includes('required') ? 400 : 500,
      body: JSON.stringify({ 
        error: error.message,
        requested_ticker: ticker_id
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
