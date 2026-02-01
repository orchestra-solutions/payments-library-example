require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Configuration from environment variables
const config = {
  apiKey: process.env.ORCHESTRA_API_KEY,
  apiBaseUrl: process.env.ORCHESTRA_API_URL || 'https://service.pcibooking.net/api',
  paymentGatewayAccountId: process.env.PAYMENT_GATEWAY_ACCOUNT_ID,
  mode: process.env.MODE || 'TEST',
  // Individual eWallet accounts
  eWalletAccounts: {
    cardPay: process.env.EWALLET_CARDPAY_ACCOUNT_ID,
    googlePay: process.env.EWALLET_GOOGLEPAY_ACCOUNT_ID,
    applePay: process.env.EWALLET_APPLEPAY_ACCOUNT_ID,
    payPal: process.env.EWALLET_PAYPAL_ACCOUNT_ID,
    bankPay: process.env.EWALLET_BANKPAY_ACCOUNT_ID,
    upi: process.env.EWALLET_UPI_ACCOUNT_ID
  }
};

// Build array of configured eWallet account IDs
function getConfiguredEWalletAccountIds() {
  return Object.values(config.eWalletAccounts).filter(Boolean);
}

// Create a payment session
app.post('/api/create-session', async (req, res) => {
  const { amount, currency, countryCode } = req.body;

  try {
    const eWalletAccountIds = getConfiguredEWalletAccountIds();

    const response = await fetch(`${config.apiBaseUrl}/EWalletOperations`, {
      method: 'POST',
      headers: {
        'Authorization': `APIKEY ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation: 'CHARGE',
        paymentGatewayAccountId: config.paymentGatewayAccountId,
        allowedeWalletAccountIds: eWalletAccountIds.length > 0 ? eWalletAccountIds : undefined,
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
  const configuredEWallets = Object.entries(config.eWalletAccounts)
    .filter(([_, value]) => !!value)
    .map(([key, _]) => key);

  res.json({
    mode: config.mode,
    hasApiKey: !!config.apiKey,
    hasPaymentGateway: !!config.paymentGatewayAccountId,
    eWalletAccounts: {
      cardPay: !!config.eWalletAccounts.cardPay,
      googlePay: !!config.eWalletAccounts.googlePay,
      applePay: !!config.eWalletAccounts.applePay,
      payPal: !!config.eWalletAccounts.payPal,
      bankPay: !!config.eWalletAccounts.bankPay,
      upi: !!config.eWalletAccounts.upi
    },
    eWalletAccountsConfigured: configuredEWallets.length
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
