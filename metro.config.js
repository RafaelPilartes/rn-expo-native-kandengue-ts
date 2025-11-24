// metro.config.js
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

// Configuração para SVG como componente
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer')
}

config.resolver.assetExts = config.resolver.assetExts.filter(
  ext => ext !== 'svg'
)
config.resolver.sourceExts.push('svg')

// config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs']

module.exports = withNativeWind(config, {
  input: './src/styles/global.css'
})
