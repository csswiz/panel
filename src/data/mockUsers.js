// User Data Layer

export const MOCK_USERS = [];

export const CURRENT_USER = {
  id: 'USR-1001',
  name: 'Account User',
  email: 'user@wizard-smm.io',
  role: 'User',
  tier: 'Standard',
  balance: 0.00,
  totalSpent: 0.00,
  ordersCount: 0,
  country: 'United States',
  countryCode: 'US',
  joinedDate: new Date().toISOString(),
  apiKey: 'smm_live_user_key',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  discountRate: 0,
  notifications: {
    emailOrders: true,
    emailDeposits: true,
    emailPromos: false,
    telegramBot: true
  }
};
