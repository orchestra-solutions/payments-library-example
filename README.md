# Orchestra Payments Library Example

A complete working example for integrating the [Orchestra Payments Library](https://www.npmjs.com/package/bluetime-ewallet) into your application.

## Quick Start

### Option A: Run Locally

#### 1. Clone this repository

```bash
git clone https://github.com/orchestra-solutions/payments-library-example.git
cd payments-library-example
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure your credentials

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your Orchestra credentials (see [Configuration](#configuration) below).

#### 4. Start the server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option B: Run in StackBlitz (with your own credentials)

To test with your own Orchestra credentials in StackBlitz:

1. **Fork this repository** to your own GitHub account
2. Open your fork in StackBlitz: `https://stackblitz.com/github/YOUR-USERNAME/payments-library-example`
3. Create a `.env` file in StackBlitz with your credentials
4. The server will restart automatically

<details>
<summary>Why fork?</summary>

Forking creates your own copy of the repository where you can safely add credentials. Never commit credentials to the main repository or any public branch, as they would be visible to everyone.

</details>

## Preview the Code

View the code structure in StackBlitz (no credentials, for reference only):

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/orchestra-solutions/payments-library-example)

## Configuration

All configuration is done via environment variables. Copy `.env.example` to `.env` and set the following values.

Don't have an Orchestra account? [Sign up free](https://portal.orchestrasolutions.com/#/register).

### Environment File Format

Create a `.env` file in the project root. Each line should follow the format:

```
VARIABLE_NAME=value
```

Rules:
- No spaces around the `=` sign
- No quotes needed for values (unless the value contains spaces)
- Lines starting with `#` are comments
- Empty values are allowed (the feature will be disabled)

### Required Settings

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `ORCHESTRA_API_KEY` | string | Your Orchestra API key | `ORCHESTRA_API_KEY=sk_live_abc123def456` |
| `PAYMENT_GATEWAY_ACCOUNT_ID` | string | Your PSP account ID configured in Orchestra Portal | `PAYMENT_GATEWAY_ACCOUNT_ID=my-stripe-account` |

### Optional Settings

| Variable | Type | Default | Description | Example |
|----------|------|---------|-------------|---------|
| `ORCHESTRA_API_URL` | URL | `https://service.pcibooking.net/api` | Orchestra API base URL | `ORCHESTRA_API_URL=https://service.pcibooking.net/api` |
| `MODE` | string | `TEST` | Environment mode: `TEST` or `LIVE` | `MODE=TEST` |
| `PORT` | number | `3000` | Server port | `PORT=3000` |

### eWallet Account Settings

Configure the payment methods you want to support. Each payment method requires its own eWallet account configured in the Orchestra Portal. Leave blank to disable that payment method.

| Variable | Type | Payment Method | Example |
|----------|------|----------------|---------|
| `EWALLET_CARDPAY_ACCOUNT_ID` | string | Card Pay (credit/debit cards) | `EWALLET_CARDPAY_ACCOUNT_ID=cardpay-account-123` |
| `EWALLET_GOOGLEPAY_ACCOUNT_ID` | string | Google Pay | `EWALLET_GOOGLEPAY_ACCOUNT_ID=gpay-merchant-456` |
| `EWALLET_APPLEPAY_ACCOUNT_ID` | string | Apple Pay | `EWALLET_APPLEPAY_ACCOUNT_ID=applepay-merchant-789` |
| `EWALLET_PAYPAL_ACCOUNT_ID` | string | PayPal | `EWALLET_PAYPAL_ACCOUNT_ID=paypal-business-abc` |
| `EWALLET_BANKPAY_ACCOUNT_ID` | string | Bank Pay (Open Banking/ACH) | `EWALLET_BANKPAY_ACCOUNT_ID=bankpay-account-def` |
| `EWALLET_UPI_ACCOUNT_ID` | string | UPI | `EWALLET_UPI_ACCOUNT_ID=upi-merchant-ghi` |

### Getting Your Credentials

1. **API Key**: Sign in to [Orchestra Portal](https://portal.orchestrasolutions.com) > Settings > API Keys
2. **Payment Gateway Account**: Portal > Resources > Payment Gateway Accounts
3. **eWallet Accounts**: Portal > Resources > eWallet Accounts

### Complete Example

```env
# Orchestra API Configuration
ORCHESTRA_API_KEY=sk_test_abc123def456ghi789
ORCHESTRA_API_URL=https://service.pcibooking.net/api
MODE=TEST

# Payment Gateway (required for processing card payments)
PAYMENT_GATEWAY_ACCOUNT_ID=my-stripe-test-account

# eWallet Accounts (configure the payment methods you want to support)
EWALLET_CARDPAY_ACCOUNT_ID=my-cardpay-account
EWALLET_GOOGLEPAY_ACCOUNT_ID=my-googlepay-account
EWALLET_APPLEPAY_ACCOUNT_ID=
EWALLET_PAYPAL_ACCOUNT_ID=
EWALLET_BANKPAY_ACCOUNT_ID=
EWALLET_UPI_ACCOUNT_ID=

# Server
PORT=3000
```

### Minimal Example (Card Payments Only)

```env
ORCHESTRA_API_KEY=sk_test_abc123def456ghi789
PAYMENT_GATEWAY_ACCOUNT_ID=my-stripe-test-account
EWALLET_CARDPAY_ACCOUNT_ID=my-cardpay-account
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
