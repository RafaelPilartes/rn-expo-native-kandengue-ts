// services/notifications/pushNotification.service.ts
import { Platform } from 'react-native'
import {
  getMessaging,
  getToken,
  deleteToken,
  onMessage,
  onTokenRefresh,
  subscribeToTopic,
  unsubscribeFromTopic,
  setBackgroundMessageHandler,
  getInitialNotification,
  requestPermission,
  AuthorizationStatus,
  registerDeviceForRemoteMessages,
  type FirebaseMessagingTypes
} from '@react-native-firebase/messaging'
import { getAuth, getIdToken } from '@react-native-firebase/auth'
import ApiDAO from '@/modules/Api/rest/Api.dao'

type NotificationRole = 'driver' | 'passenger'

// FCM Topics — match o NotificationCategory do backend
const TOPICS = {
  ALL: 'all_users',
  DRIVERS: 'drivers',
  PASSENGERS: 'passengers',
  PROMOTIONS: 'promotions',
  RIDE_UPDATES: 'ride_updates',
} as const

/**
 * Default Android notification channel ID.
 * Must match the value in AndroidManifest.xml:
 * `com.google.firebase.messaging.default_notification_channel_id`
 */
export const DEFAULT_CHANNEL_ID = 'kandengue_default'

/**
 * Central service for push notification lifecycle management.
 * Uses the modular Firebase v22+ API (getMessaging()) — no deprecated namespaced calls.
 */
export const PushNotificationService = {
  /**
   * Requests notification permission from the OS.
   * Returns true if granted, false otherwise.
   */
  async requestPermission(): Promise<boolean> {
    const authStatus = await requestPermission(getMessaging())

    const granted =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL

    if (!granted) {
      console.warn('[Push] Permission not granted:', authStatus)
    }

    return granted
  },

  /**
   * Gets the current FCM token and sends it to the Fastify backend.
   * Must be called AFTER the user is authenticated (Firebase Auth session active).
   * Safe to call on every app start — the backend upserts (updates last_seen).
   */
  async getAndRegisterToken(): Promise<string | null> {
    try {
      const messaging = getMessaging()

      // Ensure APNS token is registered on iOS before getting FCM token
      if (Platform.OS === 'ios') {
        await registerDeviceForRemoteMessages(messaging)
      }

      const token = await getToken(messaging)
      if (!token) {
        console.warn('[Push] Failed to get FCM token')
        return null
      }

      const currentUser = getAuth().currentUser
      if (!currentUser) {
        console.warn('[Push] No Firebase ID token — user not authenticated')
        return null
      }
      const idToken = await getIdToken(currentUser)

      await ApiDAO.post<{ message: string }>(
        '/api/v1/devices/register',
        { token, platform: Platform.OS === 'ios' ? 'ios' : 'android' },
        { Authorization: `Bearer ${idToken}` }
      )

      console.info('[Push] Token registered successfully')
      return token
    } catch (error) {
      // Non-fatal: push notifications will simply not work on this session
      console.error('[Push] Failed to register token:', error)
      return null
    }
  },

  /**
   * Subscribes the device to FCM topics based on user role.
   * Topics allow O(1) broadcast sends without iterating all tokens.
   * All users get `all_users` + `promotions`. Role-specific topics are added on top.
   */
  async subscribeToTopics(role: NotificationRole): Promise<void> {
    try {
      const messaging = getMessaging()

      // Common topics for all users
      await subscribeToTopic(messaging, TOPICS.ALL)
      await subscribeToTopic(messaging, TOPICS.PROMOTIONS)

      // Role-specific topics
      if (role === 'driver') {
        await subscribeToTopic(messaging, TOPICS.DRIVERS)
      } else {
        await subscribeToTopic(messaging, TOPICS.PASSENGERS)
        await subscribeToTopic(messaging, TOPICS.RIDE_UPDATES)
      }

      console.info('[Push] Subscribed to topics for role:', role)
    } catch (error) {
      console.error('[Push] Failed to subscribe to topics:', error)
    }
  },

  /**
   * Unsubscribes from all topics and removes token from backend on logout.
   * Call this when the user logs out from a specific device.
   */
  async unregisterDevice(): Promise<void> {
    try {
      const messaging = getMessaging()

      const currentUser = getAuth().currentUser
      const idToken = currentUser ? await getIdToken(currentUser) : null
      const token = await getToken(messaging)

      if (idToken && token) {
        await ApiDAO.post<{ message: string }>(
          '/api/v1/devices/unregister',
          { token },
          { Authorization: `Bearer ${idToken}` }
        )
      }

      // Unsubscribe from all topics
      await unsubscribeFromTopic(messaging, TOPICS.ALL)
      await unsubscribeFromTopic(messaging, TOPICS.PROMOTIONS)
      await unsubscribeFromTopic(messaging, TOPICS.DRIVERS)
      await unsubscribeFromTopic(messaging, TOPICS.PASSENGERS)
      await unsubscribeFromTopic(messaging, TOPICS.RIDE_UPDATES)

      // Delete local token
      await deleteToken(messaging)

      console.info('[Push] Device unregistered')
    } catch (error) {
      console.error('[Push] Failed to unregister device:', error)
    }
  },

  /**
   * Listens for token refresh events (e.g. after app reinstall or token rotation).
   * Re-registers the new token automatically.
   * Returns the unsubscribe function — call it on logout.
   */
  onTokenRefresh(): () => void {
    return onTokenRefresh(getMessaging(), async newToken => {
      console.info('[Push] Token refreshed — re-registering...')

      const currentUser = getAuth().currentUser
      if (!currentUser) return
      const idToken = await getIdToken(currentUser)

      try {
        await ApiDAO.post<{ message: string }>(
          '/api/v1/devices/register',
          {
            token: newToken,
            platform: Platform.OS === 'ios' ? 'ios' : 'android'
          },
          { Authorization: `Bearer ${idToken}` }
        )
        console.info('[Push] Refreshed token registered')
      } catch (error) {
        console.error('[Push] Failed to register refreshed token:', error)
      }
    })
  },

  /**
   * Handles notifications received while the app is in FOREGROUND.
   * FCM suppresses the system banner when the app is active — this fires instead.
   * Returns unsubscribe function.
   *
   * ℹ️ To show an actual banner in foreground, pass a handler that calls your
   *    in-app AlertContext or custom notification component.
   */
  onForegroundMessage(
    handler: (message: FirebaseMessagingTypes.RemoteMessage) => void
  ): () => void {
    return onMessage(getMessaging(), handler)
  },

  /**
   * Registers a background/quit-state message handler.
   * MUST be called at module level (before React renders), e.g. in App.tsx.
   * ⚠️ Keep this handler lean — no UI updates, minimal async work.
   * Note: Android channel creation is handled by notifee.service.ts.
   */
  setBackgroundHandler(): void {
    setBackgroundMessageHandler(getMessaging(), async remoteMessage => {
      console.info('[Push] Background message received:', remoteMessage.data)
      // Extend here: update badge counts, sync local data, etc.
    })
  },

  /**
   * Checks if the app was opened from a notification (killed state).
   * Returns the initial notification or null.
   */
  async getInitialNotification(): Promise<FirebaseMessagingTypes.RemoteMessage | null> {
    return getInitialNotification(getMessaging())
  }
}
