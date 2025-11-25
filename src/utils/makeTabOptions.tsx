import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function makeTabOptions(
  route: any,
  baseName: string,
  hiddenRoutes: string[],
  label: string,
  Icon: React.ComponentType<{ color: string; width: number; height: number }>
) {
  const insets = useSafeAreaInsets()

  const routeName = getFocusedRouteNameFromRoute(route) ?? baseName

  const shouldHideTab = hiddenRoutes.includes(routeName)

  return {
    tabBarStyle: shouldHideTab
      ? {
          display: 'none'
        }
      : {
          position: 'absolute',
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom - 4 : 6
        },

    tabBarLabel: label,

    tabBarIcon: ({ color }: { color: string }) => (
      <Icon width={24} height={24} color={color} />
    )
  }
}
