# Orchestra Payments Library Example

A complete working example for integrating the [Orchestra Payments Library](https://www.npmjs.com/package/@orchestrasolutions/ewallet) into your application.

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

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your Orchestra credentials (see [Getting Your Credentials](#getting-your-credentials) below).

### 4. Start the server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Getting Your Credentials

You need an Orchestra account before you can run this example. [Sign up free](https://portal.orchestrasolutions.com/#/register) — no credit card required.

Once you have an account, collect the following from the [Orchestra Portal](https://portal.orchestrasolutions.com):

**1. API Key**
Portal → API Keys → Create. Copy the key immediately — it is only shown once.
Direct link: [https://portal.orchestrasolutions.com/#/apikey/create](https://portal.orchestrasolutions.com/#/apikey/create)

**2. Payment Gateway Account**
Portal → Resources → Payment Gateway Accounts → Create.
For testing, create a gateway using the **NULLSuccess** provider and name it `test-success`. Use this name as your `PAYMENT_GATEWAY_ACCOUNT_ID`.

**3. eWallet Account (for card payments)**
Portal → Resources → eWallet Accounts → Create.
Create a **CardPay** eWallet account linked to your `test-success` gateway. Use the account name as your `EWALLET_CARDPAY_ACCOUNT_ID`.

See the [Getting Started guide](https://developers.orchestrasolutions.com/getting-started/create-account) for full step-by-step instructions.

---

## Configuration

All configuration is done via environment variables in the `.env` file.

### Required

| Variable | Description |
|----------|-------------|
| `ORCHESTRA_API_KEY` | Your Orchestra API key |
| `PAYMENT_GATEWAY_ACCOUNT_ID` | The name of your Payment Gateway Account in the portal |

### eWallet Accounts

Configure the payment methods you want to support. Each requires a separate eWallet account in the portal.

| Variable | Payment Method |
|----------|----------------|
| `EWALLET_CARDPAY_ACCOUNT_ID` | Card Pay (credit/debit cards) — required for basic testing |
| `EWALLET_GOOGLEPAY_ACCOUNT_ID` | Google Pay |
| `EWALLET_APPLEPAY_ACCOUNT_ID` | Apple Pay |
| `EWALLET_PAYPAL_ACCOUNT_ID` | PayPal |
| `EWALLET_BANKPAY_ACCOUNT_ID` | Bank Pay (Open Banking / ACH) |
| `EWALLET_UPI_ACCOUNT_ID` | UPI |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `ORCHESTRA_API_URL` | `https://api.orchestrasolutions.com` | Orchestra API base URL |
| `MODE` | `TEST` | `TEST` for sandbox, `LIVE` for production |
| `PORT` | `3000` | Local server port |

---

## Project Structure

```
├── server.js           # Express server — creates sessions and validates payments
├── public/
│   ├── index.html      # Checkout page
│   └── checkout.js     # Client-side Payments Library integration
├── .env.example        # Environment variables template
└── package.json
```

## How It Works

1. **Server creates a session** — calls `POST /EWalletOperations` with your gateway and eWallet account configuration
2. **Client initialises the library** — passes the session token to the Payments Library
3. **Library checks availability** — returns which payment methods are supported in the current browser
4. **Buttons are rendered** — payment buttons appear for each available method
5. **Customer pays** — the library handles the payment flow
6. **Result is validated** — the result token is sent to your server and validated via `POST /EWalletOperations/validateResults`

---

## Testing

Use `MODE=TEST` and Orchestra's mock payment gateways:

| Gateway Provider | Behaviour |
|---|---|
| **NULLSuccess** | Always approves — use for happy path testing |
| **NULLFailure** | Always declines — use for failure/error handling testing |

Test card number: `4242 4242 4242 4242` — expiry `12/2026`, CVV `123`

To test a declined payment, create a second gateway account using the **NULLFailure** provider and route a transaction through it.

---

## Documentation

- [Payments Library Setup](https://developers.orchestrasolutions.com/guides/library/setup)
- [Complete Integration Guide](https://developers.orchestrasolutions.com/guides/library/complete-example)
- [Library Reference](https://developers.orchestrasolutions.com/guides/library/reference)
- [API Reference — Start a Session](https://developers.orchestrasolutions.com/api-reference/ewalletoperations/start-an-ewallet-session)
- [Quickstart](https://developers.orchestrasolutions.com/quickstart)

## Support

- [Documentation](https://developers.orchestrasolutions.com)
- [Contact Support](https://orchestrasolutions.com/contact/)
