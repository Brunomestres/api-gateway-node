export const serviceConfig = {
  users: {
    url: process.env.USERS_SERVICE_URL || 'http://localhost:30001',
    timeout: 10000,
  },
  products: {
    url: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:30002',
    timeout: 10000,
  },
  checkout: {
    url: process.env.CHECKOUT_SERVICE_URL || 'http://localhost:30003',
    timeout: 10000,
  },
  payments: {
    url: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:30004',
    timeout: 10000,
  },
} as const;
