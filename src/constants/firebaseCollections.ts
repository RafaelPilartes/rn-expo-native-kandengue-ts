// constants/firebaseCollections.ts
export const firebaseCollections = {
  // ============================================
  // USERS
  users: {
    root: 'users',
    single: (userId: string) => `users/${userId}`,
    documents: (userId: string) => `users/${userId}/documents`,
    transactions: (userId: string) => `users/${userId}/transactions`,
    notifications: (userId: string) => `users/${userId}/notifications`,
  },

  // ============================================
  // ADMIN
  admins: {
    root: 'admins',
    single: (adminId: string) => `admins/${adminId}`,
  },

  // ============================================
  // DRIVERS
  drivers: {
    root: 'drivers',
    single: (driverId: string) => `drivers/${driverId}`,
  },

  // ============================================
  // VEHICLES
  vehicles: {
    root: 'vehicles',
    single: (vehicleId: string) => `vehicles/${vehicleId}`,
    documents: (vehicleId: string) => `vehicles/${vehicleId}/documents`,
  },

  // ============================================
  // RIDES
  rides: {
    root: 'rides',
    single: (rideId: string) => `rides/${rideId}`,
  },

  // ============================================
  // CHATS
  chats: {
    root: 'chats',
    single: (chatId: string) => `chats/${chatId}`,
    messages: (chatId: string) => `chats/${chatId}/messages`
  },

  // =============================================
  // RIDERATES
  rideRates: {
    root: 'rideRates',
    single: (rideRateId: string) => `rideRates/${rideRateId}`,
  },

  // =============================================
  // RIDETRACKINGS
  rideTrackings: {
    root: 'rideTrackings',
    single: (rideTrackingId: string) => `rideTrackings/${rideTrackingId}`,
  },

  // ============================================
  // TRANSACTIONS
  transactions: {
    root: 'transactions',
    single: (transactionId: string) => `transactions/${transactionId}`,
  },

  // ============================================
  // WALLET
  wallets: {
    root: 'wallets',
    single: (walletId: string) => `wallets/${walletId}`,
  },

  // =============================================
  // WALLET TOPUP REQUESTS
  requests: {
    root: 'topupRequests',
    single: (requestId: string) => `topupRequests/${requestId}`,
  },

  // ============================================
  // DOCUMENTS
  documents: {
    root: 'documents',
    single: (documentId: string) => `documents/${documentId}`,
  },

  // ============================================
  // NOTIFICATIONS
  notifications: {
    root: 'notifications',
    single: (notificationId: string) => `notifications/${notificationId}`,
  },

  // ============================================
  // RATES
  rates: {
    root: 'rates',
    current: 'rates/current',
  },

  // ============================================
  // COMPLAINTS
  complaints: {
    root: 'complaints',
  },

  // ============================================
  // SYSTEM LOGS
  logs: {
    root: 'logs',
    single: (logId: string) => `logs/${logId}`,
  },

  // ============================================
  // PROMOTIONS
  promotions: {
    root: 'promotions',
    single: (code: string) => `promotions/${code}`,
  },

  // ============================================
  // PROMOTION USAGES
  promotionUsages: {
    root: 'promotion_usages',
    single: (id: string) => `promotion_usages/${id}`,
    activeReservation: (userId: string) =>
      `promotion_usages/active_reservation_${userId}`,
    ridePromo: (rideId: string) => `promotion_usages/${rideId}_promo`,
  },

  // ============================================
  // REFERRAL EARNINGS
  referralEarnings: {
    root: 'referral_earnings',
    single: (id: string) => `referral_earnings/${id}`,
  },

  // ============================================
  // WITHDRAWAL REQUESTS
  withdrawalRequests: {
    root: 'withdrawal_requests',
    single: (id: string) => `withdrawal_requests/${id}`,
  },

  // ============================================
  // APP CONFIG
  appConfig: {
    root: 'app_config',
    referralSettings: 'app_config/referral_settings',
  },
};
