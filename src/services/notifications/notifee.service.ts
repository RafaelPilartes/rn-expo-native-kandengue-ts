// services/notifications/notifee.service.ts
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
  type Notification,
} from '@notifee/react-native'
import { Platform } from 'react-native'

/** Channel ID — must match AndroidManifest meta-data value */
export const CHANNEL_ID = 'kandengue_default'

/**
 * Creates the Android notification channel with HIGH importance.
 * HIGH importance = banner heads-up + sound + vibration (like Uber/Yango).
 * Idempotent — Android ignores duplicate channel creation.
 * Must be called before displaying any notification.
 */
export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return

  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Kandengue Atrevido',
    description: 'Corridas, promoções e mensagens',
    importance: AndroidImportance.HIGH,   // heads-up banner + sound
    visibility: AndroidVisibility.PUBLIC, // shows on lock screen
    vibration: true,
    vibrationPattern: [300, 500],
    sound: 'default',
  })
}

/**
 * Displays a real system notification (heads-up banner with sound).
 * Works in FOREGROUND — this is the "Uber/Yango style" notification.
 *
 * @param title  Notification title
 * @param body   Notification body text
 * @param data   Optional key-value payload for deep linking (handled in onForegroundEvent)
 */
export async function displayNotification(
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<void> {
  // Ensure channel exists before displaying (idempotent)
  await setupNotificationChannel()

  await notifee.displayNotification({
    title,
    body,
    data,
    android: {
      channelId: CHANNEL_ID,
      importance: AndroidImportance.HIGH,
      pressAction: { id: 'default' }, // brings app to foreground on tap
      sound: 'default',
      vibrationPattern: [300, 500],
      smallIcon: 'ic_launcher', // must exist in android/app/src/main/res
      showTimestamp: true,
    },
    ios: {
      sound: 'default',
      foregroundPresentationOptions: {
        alert: true,  // show banner in foreground
        badge: true,
        sound: true,
      },
    },
  } as Notification)
}

/**
 * Registers a foreground event handler for notifee notifications.
 * Handles press events (e.g. navigate to ride details).
 * Returns the unsubscribe function.
 */
export function setupNotifeeEventHandler(
  onPress?: (data: Record<string, string> | undefined) => void,
): () => void {
  return notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      onPress?.(detail.notification?.data as Record<string, string> | undefined)
    }
  })
}

/**
 * Registers a background event handler for notifee (required by notifee).
 * Must be called at module level (before React renders), same as FCM background handler.
 */
export function setupNotifeeBackgroundHandler(): void {
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      // App was opened from a notifee notification in background
      console.info('[Notifee] Background press:', detail.notification?.data)
    }
  })
}
