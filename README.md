# Orchestra Payments Library Example

A complete working example for integrating the [Orchestra Payments Library](https://www.npmjs.com/package/bluetime-ewallet) into your application.

## Quick Start

### 1. Clone this repository

```bash
git clone https://github.com/orchestra-solutions/payments-library-example.git
cd payments-library-example
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your credentials

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your Orchestra credentials (see [Configuration](#configuration) below).

### 4. Start the server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Try it Online

Open this example in StackBlitz:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/orchestra-solutions/payments-library-example)

## Configuration

All configuration is done via environment variables. Copy `.env.example` to `.env` and set the following values:

| Variable | Required | Description |
|----------|----------|-------------|
| `ORCHESTRA_API_KEY` | Yes | Your Orchestra API key from the [Portal](https://portal.orchestrasolutions.com) |
| `ORCHESTRA_API_URL` | No | API base URL (default: `https://service.pcibooking.net/api`) |
| `PAYMENT_GATEWAY_ACCOUNT_ID` | Yes | Your PSP account ID configured in Orchestra |
| `EWALLET_ACCOUNT_IDS` | No | Comma-separated list of eWallet account IDs (PayPal, Google Pay, Apple Pay) |
| `MODE` | No | `TEST` for sandbox or `LIVE` for production (default: `TEST`) |
| `PORT` | No | Server port (default: `3000`) |

### Getting Your Credentials

1. **API Key**: Sign in to [Orchestra Portal](https://portal.orchestrasolutions.com) > Settings > API Keys
2. **Payment Gateway Account**: Portal > Resources > Payment Gateway Accounts
3. **eWallet Accounts**: Portal > Resources > eWallet Accounts

### Example Configuration

```env
ORCHESTRA_API_KEY=sk_test_abc123...
PAYMENT_GATEWAY_ACCOUNT_ID=my-stripe-account
EWALLET_ACCOUNT_IDS=my-paypal-account,my-googlepay-account
MODE=TEST
```

## Project Structure

```
├── server.js           # Express server - creates sessions and validates payments
├── public/
│   ├── index.html      # Checkout page HTML
│   └── checkout.js     # Client-side Payments Library integration
├── .env.example        # Environment variables template
└── package.json
```

## How It Works

1. **Server creates session**: Your server calls Orchestra API to create a payment session and receives a JWT
2. **Client initializes library**: The JWT is passed to the client, which initializes the Payments Library
3. **Check availability**: The library returns which payment methods are available for this browser/device
4. **Display buttons**: You specify which buttons to display and where
5. **Customer pays**: Customer clicks a button and completes payment
6. **Handle result**: The result JWT is returned to the client and passed to your server for validation

See the [full documentation](https://developers.orchestrasolutions.com/guides/library/setup) for more details.

## Testing

Use `MODE=TEST` and Orchestra's mock payment gateways for testing:

- **NULLSuccess**: Always approves transactions
- **NULLFailure**: Always declines transactions

Test card numbers for sandbox:
- `4111 1111 1111 1111` - Visa (success)
- `5500 0000 0000 0004` - Mastercard (success)

## Documentation

- [Payments Library Setup](https://developers.orchestrasolutions.com/guides/library/setup)
- [Library Reference](https://developers.orchestrasolutions.com/guides/library/reference)
- [API Reference](https://developers.orchestrasolutions.com/api-reference/ewalletoperations/start-an-ewallet-session)

## Support

- [Documentation](https://developers.orchestrasolutions.com)
- [GitHub Discussions](https://github.com/orchestra-solutions/p18n/discussions)
- [Contact Support](https://orchestrasolutions.com/contact/)
