require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Configuration from environment variables
const config = {
  apiKey: process.env.ORCHESTRA_API_KEY || 'your-api-key',
  apiBaseUrl: process.env.ORCHESTRA_API_URL || 'https://service.pcibooking.net/api',
  paymentGatewayAccountId: process.env.PAYMENT_GATEWAY_ACCOUNT_ID || 'your-psp-account',
  eWalletAccountIds: (process.env.EWALLET_ACCOUNT_IDS || '').split(',').filter(Boolean),
  mode: process.env.MODE || 'TEST'
};

// Create a payment session
app.post('/api/create-session', async (req, res) => {
  const { amount, currency, countryCode } = req.body;

  try {
    const response = await fetch(`${config.apiBaseUrl}/EWalletOperations`, {
      method: 'POST',
      headers: {
        'Authorization': `APIKEY ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation: 'CHARGE',
        paymentGatewayAccountId: config.paymentGatewayAccountId,
        allowedeWalletAccountIds: config.eWalletAccountIds.length > 0 ? config.eWalletAccountIds : undefined,
        currencyCode: currency || 'USD',
        countryCode: countryCode || 'US',
        amount: amount || 49.99,
        mode: config.mode
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Orchestra API error:', response.status, errorText);
      return res.status(response.status).json({ error: 'Failed to create session', details: errorText });
    }

    const data = await response.json();
    res.json({ sessionToken: data.Token });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Validate payment results
app.post('/api/validate-payment', async (req, res) => {
  const { resultToken } = req.body;

  try {
    const response = await fetch(`${config.apiBaseUrl}/EWalletOperations/validateResults`, {
      method: 'POST',
      headers: {
        'Authorization': `APIKEY ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: resultToken })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Validation error:', response.status, errorText);
      return res.status(response.status).json({ error: 'Validation failed', details: errorText });
    }

    const validationResult = await response.json();
    res.json(validationResult);
  } catch (error) {
    console.error('Error validating payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current configuration (for display purposes, excludes sensitive data)
app.get('/api/config', (req, res) => {
  res.json({
    mode: config.mode,
    hasApiKey: !!config.apiKey && config.apiKey !== 'your-api-key',
    hasPaymentGateway: !!config.paymentGatewayAccountId && config.paymentGatewayAccountId !== 'your-psp-account',
    eWalletAccountsConfigured: config.eWalletAccountIds.length
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Configuration:', {
    mode: config.mode,
    apiBaseUrl: config.apiBaseUrl,
    hasApiKey: !!config.apiKey && config.apiKey !== 'your-api-key'
  });
});
