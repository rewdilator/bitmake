const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Debug: Log the entire event
  console.log("Incoming event:", JSON.stringify(event, null, 2));
  
  const { ticker_id } = event.queryStringParameters || {};
  
  if (!ticker_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: "ticker_id is required",
        received_query: event.queryStringParameters,
        path: event.path
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }

  try {
    const apiUrl = `https://www.serenity.exchange/api/v2/orderbook/coingecko?ticker_id=${ticker_id}`;
    console.log("Fetching from:", apiUrl);
    
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const data = await response.json();
    
    if (!data.bids || !data.asks) {
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
      body: JSON.stringify({ 
        error: error.message,
        attempted_url: `https://www.serenity.exchange/api/v2/orderbook/coingecko?ticker_id=${ticker_id}`
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
