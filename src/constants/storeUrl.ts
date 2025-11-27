import { Platform } from 'react-native'
import { AppConfigInfo } from './config'

export const getStoreUrl = () => {
  if (Platform.OS === 'android') {
    return `https://play.google.com/store/apps/details?id=${AppConfigInfo.androidPackageName}`
  } else {
    return `https://apps.apple.com/app/apple-store/${AppConfigInfo.iosBundleIdentifier}`
  }
}
