// plugins/withFcmDefaultChannel.js
const { withAndroidManifest } = require('@expo/config-plugins')

/**
 * Expo Config Plugin — adds FCM default notification channel meta-data
 * to AndroidManifest.xml persistently.
 *
 * This runs during `expo prebuild` and `eas build`, ensuring the changes
 * survive every native regeneration cycle.
 *
 * What it injects inside <application>:
 *   - default_notification_channel_id  → used by FCM for background notifications (Android 8+)
 *   - default_notification_icon        → icon shown in the status bar
 */
module.exports = function withFcmDefaultChannel(config) {
  return withAndroidManifest(config, config => {
    const application = config.modResults.manifest.application[0]

    if (!application['meta-data']) {
      application['meta-data'] = []
    }

    const entries = [
      {
        'android:name': 'com.google.firebase.messaging.default_notification_channel_id',
        'android:value': 'kandengue_default',
        'tools:replace': 'android:value',
      },
      {
        'android:name': 'com.google.firebase.messaging.default_notification_icon',
        'android:resource': '@mipmap/ic_launcher',
        'tools:replace': 'android:resource',
      },
    ]

    for (const entry of entries) {
      // Idempotent — skip if already present (avoids duplicate meta-data tags)
      const alreadyExists = application['meta-data'].some(
        item => item.$['android:name'] === entry['android:name'],
      )

      if (!alreadyExists) {
        application['meta-data'].push({ $: entry })
      }
    }

    return config
  })
}
