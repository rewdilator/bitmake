<?php
// API endpoint
$apiUrl = 'https://www.serenity.exchange/api/v2/trade/coingecko/tickers';

// Initialize cURL session
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); // Verify SSL certificate
curl_setopt($ch, CURLOPT_TIMEOUT, 30); // Timeout in seconds

// Execute the request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo 'Error fetching API: ' . curl_error($ch);
    exit;
}

// Get HTTP status code
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Close cURL session
curl_close($ch);

// Check if the request was successful
if ($httpCode === 200) {
    // Decode JSON response
    $data = json_decode($response, true);
    
    // Check if JSON decoding was successful
    if (json_last_error() === JSON_ERROR_NONE) {
        // Process the data as needed
        echo '<pre>';
        print_r($data);
        echo '</pre>';
    } else {
        echo 'Error decoding JSON response: ' . json_last_error_msg();
    }
} else {
    echo 'API request failed with HTTP code: ' . $httpCode;
    echo '<br>Response: ' . $response;
}
?>