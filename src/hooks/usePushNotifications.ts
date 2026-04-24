// hooks/usePushNotifications.ts
import { useEffect, useRef } from 'react'
import { PushNotificationService } from '@/services/notifications/pushNotification.service'
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging'

interface UsePushNotificationsOptions {
  /**
   * The Firebase UID of the authenticated user.
   * When null/undefined, the hook does nothing (user not logged in).
   */
  userId: string | null | undefined

  /**
   * User role — determines which FCM topic to subscribe to.
   */
  role: 'driver' | 'passenger'

  /**
   * Optional handler for notifications received while app is in FOREGROUND.
   * Use this to show your in-app toast/banner UI.
   */
  onForegroundMessage?: (
    message: FirebaseMessagingTypes.RemoteMessage,
  ) => void

  /**
   * Called when the OS notification permission is denied/blocked.
   * Use this to show an alert directing the user to app settings.
   */
  onPermissionBlocked?: () => void
}

/**
 * Manages the full push notification lifecycle for an authenticated user.
 *
 * Usage (place inside an authenticated screen or provider):
 * ```tsx
 * usePushNotifications({ userId: user?.firebase_uid, role: 'passenger' })
 * ```
 */
export function usePushNotifications({
  userId,
  role,
  onForegroundMessage,
  onPermissionBlocked,
}: UsePushNotificationsOptions): void {
  const tokenRefreshUnsubRef = useRef<(() => void) | null>(null)
  const foregroundUnsubRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!userId) return

    let cancelled = false

    async function setup() {
      const granted = await PushNotificationService.requestPermission()

      if (!granted) {
        // Notify the consumer that permission is blocked
        onPermissionBlocked?.()
        return
      }

      if (cancelled) return

      await PushNotificationService.getAndRegisterToken()
      if (cancelled) return

      await PushNotificationService.subscribeToTopics(role)
      if (cancelled) return

      // Listen for token refresh (fires when FCM rotates the token)
      tokenRefreshUnsubRef.current = PushNotificationService.onTokenRefresh()

      // Handle foreground messages
      foregroundUnsubRef.current = PushNotificationService.onForegroundMessage(
        message => {
          onForegroundMessage?.(message)
        },
      )

      // Check if app was opened from a notification (killed state)
      const initialNotification =
        await PushNotificationService.getInitialNotification()
      if (initialNotification) {
        console.info(
          '[Push] App opened from notification:',
          initialNotification.data,
        )
        // TODO: deep link / navigate to relevant screen
      }
    }

    setup()

    return () => {
      cancelled = true
      tokenRefreshUnsubRef.current?.()
      foregroundUnsubRef.current?.()
    }
  }, [userId, role]) // Re-runs if user changes (e.g. account switch)
}
