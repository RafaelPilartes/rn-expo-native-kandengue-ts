// plugins/withNotifeeGradle.js
const { withProjectBuildGradle } = require('@expo/config-plugins')

/**
 * Expo Config Plugin — injects the @notifee/react-native local Maven repository
 * into the root build.gradle persistently.
 *
 * @notifee/react-native ships its Android AAR via a local Maven repo inside
 * node_modules. Without this, Gradle fails with:
 *   "Could not find any matches for app.notifee:core as no versions are available"
 *
 * This plugin ensures the entry survives every `expo prebuild` and `eas build`.
 */
module.exports = function withNotifeeGradle(config) {
  return withProjectBuildGradle(config, config => {
    const contents = config.modResults.contents

    const NOTIFEE_REPO = `maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }`

    // Idempotent — only inject if not already present
    if (contents.includes('app.notifee') || contents.includes(NOTIFEE_REPO)) {
      return config
    }

    // Inject after jitpack entry inside allprojects { repositories { ... } }
    config.modResults.contents = contents.replace(
      `maven { url 'https://www.jitpack.io' }`,
      `maven { url 'https://www.jitpack.io' }\n    ${NOTIFEE_REPO}`,
    )

    return config
  })
}
