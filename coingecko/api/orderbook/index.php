<?php
function fetchOrderBook($pair) {
    // Validate the pair format (simple check for underscore)
    if (!preg_match('/^[a-z0-9]+_[a-z0-9]+$/i', $pair)) {
        throw new Exception('Invalid pair format. Expected format: base_quote (e.g., btc_usdt)');
    }

    $apiUrl = "https://www.serenity.exchange/api/v2/trade/coingecko/orderbook?ticker_id=" . urlencode($pair);
    
    $headers = [
        'Accept: application/json',
        'Content-Type: application/json',
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if ($response === false) {
        throw new Exception('cURL error: ' . curl_error($ch));
    }
    
    curl_close($ch);
    
    if ($httpCode !== 200) {
        throw new Exception("API returned HTTP code: $httpCode. Response: " . $response);
    }
    
    $data = json_decode($response, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON decode error: ' . json_last_error_msg());
    }
    
    return $data;
}

// Example usage
try {
    // Specify the trading pair (e.g., btc_usdt, eth_usdt, etc.)
    $tradingPair = 'btc_usdt';
    
    // Fetch the order book
    $orderBook = fetchOrderBook($tradingPair);
    
    // Display the results
    echo "<h2>Order Book for {$tradingPair}</h2>";
    echo "<h3>Bids (Buy Orders)</h3>";
    echo "<pre>" . print_r($orderBook['bids'] ?? [], true) . "</pre>";
    
    echo "<h3>Asks (Sell Orders)</h3>";
    echo "<pre>" . print_r($orderBook['asks'] ?? [], true) . "</pre>";
    
    echo "<h3>Metadata</h3>";
    echo "<pre>" . print_r([
        'timestamp' => $orderBook['timestamp'] ?? null,
        'ticker_id' => $orderBook['ticker_id'] ?? null,
    ], true) . "</pre>";
    
} catch (Exception $e) {
    echo "<div style='color: red;'>Error: " . htmlspecialchars($e->getMessage()) . "</div>";
}
?>