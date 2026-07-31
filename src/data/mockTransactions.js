export const MOCK_TRANSACTIONS = [];
export const MOCK_INVOICES = [];
export const MOCK_COUPONS = [];

export const PAYMENT_METHODS = [
  { id: 'stripe', name: 'Credit / Debit Card (Stripe)', fee: '0%', min: 10, max: 5000, icon: 'CreditCard', popular: true, desc: 'Instant deposit via Visa, MasterCard, Amex' },
  { id: 'paypal', name: 'PayPal Express', fee: '2.5%', min: 15, max: 2000, icon: 'DollarSign', popular: false, desc: 'Instant automated balance credit' },
  { id: 'crypto', name: 'Cryptocurrency (NOWPayments)', fee: '0%', min: 20, max: 50000, icon: 'Coins', popular: true, desc: 'USDT (TRC20), BTC, ETH, SOL' },
  { id: 'binance', name: 'Binance Pay', fee: '0%', min: 10, max: 10000, icon: 'QrCode', popular: false, desc: 'Zero fee instant crypto transfer' },
  { id: 'wire', name: 'Bank Wire / SWIFT Transfer', fee: '0%', min: 500, max: 100000, icon: 'Building', popular: false, desc: '1-2 business days processing time' },
];
