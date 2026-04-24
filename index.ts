import { registerRootComponent } from 'expo'

import App from './src/App'

import { PushNotificationService } from './src/services/notifications/pushNotification.service'
import { setupNotifeeBackgroundHandler } from './src/services/notifications/notifee.service'

// ⚠️ Must be registered at module level (before React renders)
PushNotificationService.setBackgroundHandler()
setupNotifeeBackgroundHandler()

if (!__DEV__) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
}

registerRootComponent(App)
