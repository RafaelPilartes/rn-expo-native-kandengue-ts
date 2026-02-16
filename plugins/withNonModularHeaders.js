const { withXcodeProject } = require('expo/config-plugins')

/**
 * Expo config plugin to fix React Native Firebase iOS build error:
 * "include of non-modular header inside framework module"
 *
 * Sets CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES = YES
 * for all build configurations.
 */
const withNonModularHeaders = config => {
  return withXcodeProject(config, async config => {
    const xcodeProject = config.modResults
    const buildConfigurations = xcodeProject.pbxXCBuildConfigurationSection()

    for (const key in buildConfigurations) {
      const buildConfig = buildConfigurations[key]
      if (typeof buildConfig === 'object' && buildConfig.buildSettings) {
        buildConfig.buildSettings.CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES =
          'YES'
      }
    }

    return config
  })
}

module.exports = withNonModularHeaders
