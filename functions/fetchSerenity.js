const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Get the original request path
  const requestPath = event.headers['x-netlify-original-path'] || event.path;
  
  // Determine if this is an orderbook request
  const isOrderbookRequest = requestPath.includes('/api/orderbook');
  const { ticker_id } = event.queryStringParameters;

  try {
    let apiUrl;
    
    if (isOrderbookRequest) {
      if (!ticker_id) {
        throw new Error('ticker_id parameter is required for orderbook');
      }
      apiUrl = `https://www.serenity.exchange/api/v2/trade/coingecko/orderbook?ticker_id=${ticker_id}`;
    } else {
      apiUrl = 'https://www.serenity.exchange/api/v2/trade/coingecko/tickers';
    }

    console.log(`Fetching from: ${apiUrl}`);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Serenity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Additional validation for orderbook data
    if (isOrderbookRequest && (!data.bids || !data.asks)) {
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
    console.error('Error:', error.message);
    return {
      statusCode: error.message.includes('required') ? 400 : 500,
      body: JSON.stringify({ 
        error: error.message,
        requested_ticker: ticker_id,
        debug: {
          original_path: requestPath,
          is_orderbook_request: isOrderbookRequest
        }
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
