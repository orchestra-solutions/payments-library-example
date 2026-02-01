// Store engine reference globally for result handling
let engine = null;

async function initPayment() {
  const loadingEl = document.getElementById('loading');
  const paymentSection = document.getElementById('payment-section');
  const resultEl = document.getElementById('result');
  const configStatus = document.getElementById('config-status');

  try {
    // Check configuration status
    const configResponse = await fetch('/api/config');
    const config = await configResponse.json();

    if (!config.hasApiKey) {
      configStatus.className = 'config-status warning';
      configStatus.innerHTML = '<strong>Configuration needed:</strong> Set your ORCHESTRA_API_KEY in the .env file. See README for details.';
      loadingEl.textContent = 'Please configure your API credentials';
      return;
    }

    configStatus.innerHTML = `Mode: <strong>${config.mode}</strong> | Gateway: ${config.hasPaymentGateway ? 'Configured' : 'Not set'} | eWallet accounts: ${config.eWalletAccountsConfigured}`;

    // 1. Get session token from server
    const response = await fetch('/api/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 49.99,
        currency: 'USD',
        countryCode: 'US'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to create session');
    }

    const { sessionToken } = await response.json();

    // 2. Initialize the Payments Library
    engine = new eWallet.Engine(sessionToken);

    // 3. Check available payment methods
    const available = await engine.checkAvailability();
    console.log('Available payment methods:', available);

    if (available.length === 0) {
      loadingEl.textContent = 'No payment methods available. Check your configuration.';
      return;
    }

    // 4. Build list of buttons to display
    const allButtons = [
      { name: 'CardPay', domEntitySelector: '#card-button' },
      { name: 'GooglePay', domEntitySelector: '#gpay-button' },
      { name: 'ApplePay', domEntitySelector: '#applepay-button' },
      { name: 'PayPal', domEntitySelector: '#paypal-button' }
    ];

    const buttons = allButtons.filter(btn => available.includes(btn.name));

    // Hide loading, show payment section
    loadingEl.style.display = 'none';
    paymentSection.style.display = 'block';

    // 5. Render the payment buttons
    engine.payBy(buttons, handleResult, { color: 'Dark', text: 'Pay' });

  } catch (error) {
    console.error('Initialization error:', error);
    loadingEl.textContent = 'Error: ' + error.message;
    resultEl.textContent = error.message;
    resultEl.className = 'error';
  }
}

async function handleResult(result) {
  const resultEl = document.getElementById('result');

  // User cancelled
  if (!result) {
    resultEl.textContent = 'Payment cancelled';
    resultEl.className = 'info';
    return;
  }

  try {
    // Parse the result token
    const [data, success] = engine.parseResultToken(result.token);
    console.log('Payment result:', data);

    // Check if payment succeeded on client side
    if (!data.clientSuccess) {
      resultEl.textContent = 'Payment failed: ' + (data.clientErrorMessage || 'Unknown error');
      resultEl.className = 'error';
      return;
    }

    // Handle PSP charge results (CardPay, GooglePay, ApplePay)
    if (data.upgChargeResults) {
      if (data.upgChargeResults.operationResultCode === 'Success') {
        resultEl.innerHTML = `
          <strong>Payment successful!</strong><br>
          Gateway: ${data.upgChargeResults.gatewayName}<br>
          Reference: ${data.upgChargeResults.gatewayReference}<br>
          Amount: ${data.upgChargeResults.amount} ${data.upgChargeResults.currency}
        `;
        resultEl.className = 'success';
      } else {
        resultEl.textContent = 'Payment declined: ' + (data.upgChargeResults.operationResultDescription || data.upgChargeResults.operationResultCode);
        resultEl.className = 'error';
      }
    }

    // Handle direct charge results (PayPal, BankPay)
    if (data.directChargeResults) {
      if (data.directChargeResults.success) {
        resultEl.innerHTML = '<strong>Payment successful!</strong><br>Provider: PayPal';
        resultEl.className = 'success';
      } else {
        resultEl.textContent = 'Payment failed: ' + data.directChargeResults.message;
        resultEl.className = 'error';
      }
    }

    // Handle tokenization results
    if (data.tokenAndMaskedCardModel) {
      const card = data.tokenAndMaskedCardModel.bankCard;
      console.log('Card tokenized:', {
        type: card.type,
        lastFour: card.number,
        token: data.tokenAndMaskedCardModel.token
      });
    }

    // Validate with server (in production, always validate server-side)
    const validationResponse = await fetch('/api/validate-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resultToken: result.token })
    });

    const validationResult = await validationResponse.json();
    console.log('Server validation:', validationResult);

  } catch (error) {
    console.error('Error handling result:', error);
    resultEl.textContent = 'Error processing payment: ' + error.message;
    resultEl.className = 'error';
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initPayment);
