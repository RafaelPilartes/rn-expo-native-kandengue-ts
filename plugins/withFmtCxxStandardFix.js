// plugins/withFmtCxxStandardFix.js
const { withPodfile } = require('@expo/config-plugins')

/**
 * Expo Config Plugin — forces the CocoaPods `fmt` target to build at C++17.
 *
 * fmt 11.0.2 (bundled by React Native's own third-party-podspecs, not
 * something this project controls directly) gates its FMT_STRING macro on a
 * `consteval`-based code path whenever the compiler defines `__cpp_consteval`
 * (i.e. compiling at C++20+). That path has a real bug that very new Clang
 * versions (Xcode 16+/26+) reject with:
 *   "call to consteval function ... is not a constant expression"
 *   in ios/Pods/fmt/include/fmt/format-inl.h
 *
 * fmt doesn't need C++20 itself, so pinning just this one pod target's
 * language standard to C++17 skips the broken code path entirely without
 * touching the rest of the project (Fabric etc. still build at C++20).
 *
 * This runs during `expo prebuild` and `eas build`, so the patch survives
 * every native regeneration cycle instead of living only in a manually
 * edited (and gitignored) ios/Podfile.
 */
module.exports = function withFmtCxxStandardFix(config) {
  return withPodfile(config, config => {
    const contents = config.modResults.contents
    const MARKER = "target.name == 'fmt'"

    // Idempotent — skip if already present
    if (contents.includes(MARKER)) {
      return config
    }

    const SNIPPET = `
    # Xcode 16+/26+ clang's __cpp_consteval support trips a bug in
    # fmt 11.0.2's FMT_STRING/basic_format_string consteval path.
    # fmt only needs C++17, so build it at that standard to skip
    # fmt's consteval code path entirely (base.h gates FMT_USE_CONSTEVAL
    # on FMT_CPLUSPLUS >= 201709L).
    installer.pods_project.targets.each do |target|
      if target.name == 'fmt'
        target.build_configurations.each do |config|
          config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'gnu++17'
        end
      end
    end
`

    const anchor = /(react_native_post_install\(\s*installer,\s*config\[:reactNativePath\],[\s\S]*?\)\s*\n)/

    if (!anchor.test(contents)) {
      throw new Error(
        'withFmtCxxStandardFix: could not find react_native_post_install(...) call in Podfile to anchor the fmt patch.',
      )
    }

    config.modResults.contents = contents.replace(anchor, `$1${SNIPPET}`)

    return config
  })
}
